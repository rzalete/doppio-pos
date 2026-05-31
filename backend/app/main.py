from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import auth as auth_router
from app.api import categories as categories_router
from app.api import products as products_router
from app.api import users as users_router
from app.api import orders as orders_router

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}


app.include_router(auth_router.router)
app.include_router(categories_router.router)
app.include_router(products_router.router)
app.include_router(users_router.router)
app.include_router(orders_router.router)