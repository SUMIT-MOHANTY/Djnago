import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, conint, constr
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from backend.config.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

router = APIRouter()
PRIMARY_KEY_NAME = "ledger_entry_id"

class LedgerRow(BaseModel):
    tx_id: str
    account_id: str
    delta: str
    balance: str
    timestamp: str

class PaginationParams(BaseModel):
    page: conint(ge=1) = 1
    limit: conint(ge=1, le=500) = 50
    from_tx: Optional[constr(strip_whitespace=True)] = None
    to_tx: Optional[constr(strip_whitespace=True)] = None

async def get_ledger(request):  # FastAPI style endpoint
    try:
        params = PaginationParams(
            page=request.query_params.get("page", 1),
            limit=request.query_params.get("limit", 50),
            from_tx=request.query_params.get("from_tx"),
            to_tx=request.query_params.get("to_tx")
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    logger.info(f"Ledger fetch page={params.page} limit={params.limit}")

    offset = (params.page - 1) * params.limit

    try:
        async with AsyncSessionLocal() as session:
            base_query = """
                SELECT tx_id, account_id, delta::text, balance::text, timestamp
                FROM ledger
                WHERE 1=1
            """
            query_params = {"limit": params.limit, "offset": offset}

            if params.from_tx:
                base_query += " AND tx_id >= :from_tx"
                query_params["from_tx"] = params.from_tx
            if params.to_tx:
                base_query += " AND tx_id <= :to_tx"
                query_params["to_tx"] = params.to_tx

            base_query += " ORDER BY timestamp ASC LIMIT :limit OFFSET :offset"

            result = await session.execute(text(base_query), query_params)
            rows = [dict(row._mapping) for row in result]

            # Get total count for pagination
            count_query = "SELECT COUNT(*) FROM ledger WHERE 1=1"
            count_params = {}
            if params.from_tx:
                count_query += " AND tx_id >= :from_tx"
                count_params["from_tx"] = params.from_tx
            if params.to_tx:
                count_query += " AND tx_id <= :to_tx"
                count_params["to_tx"] = params.to_tx

            total_count = await session.execute(text(count_query), count_params)
            total = total_count.scalar()

            return {
                "count": len(rows),
                "total": total,
                "page": params.page,
                "total_pages": max((total + params.limit - 1) // params.limit, 1),
                "results": rows
            }

    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=503, detail="Database connection failed")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Read-only endpoint registration
@router.get("/")
async def ledger_endpoint(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    from_tx: Optional[str] = None,
    to_tx: Optional[str] = None
):
    """Read-only ledger view endpoint"""
    from fastapi import Request
    fake_request = type('_', (), {'query_params': {
        'page': page,
        'limit': limit,
        'from_tx': from_tx,
        'to_tx': to_tx
    }})()
    return await get_ledger(fake_request)

# Handle non-GET methods
@router.api_route("/", methods=["POST", "PUT", "DELETE", "PATCH"])
async def method_not_allowed():
    raise HTTPException(status_code=405, detail="Method not allowed")
