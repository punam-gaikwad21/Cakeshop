from django.urls import path

from rest_framework.routers import DefaultRouter
from .api_views import CakeViewSet, CategoryViewSet, DashboardStatsView

router = DefaultRouter()

router.register(
    "cakes",
    CakeViewSet,
    basename="cake"
)
router.register(
    "categories",
    CategoryViewSet,
    basename="category"
)



urlpatterns = router.urls + [
    path(
        "dashboard/",
        DashboardStatsView.as_view(),
        name="dashboard-stats"
    ),
]