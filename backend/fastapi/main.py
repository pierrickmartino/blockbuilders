from fastapi import Depends, FastAPI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db import AsyncSessionLocal

app = FastAPI()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@app.get("/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}

@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT 1;"))
    return {"db_test": result.scalar()}