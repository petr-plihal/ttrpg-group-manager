from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user/<int:user_id>/", views.user_detail, name="user_detail"),
    path("group/<int:group_id>/", views.group_detail, name="group_detail"),
    path("user/<int:user_id>/groups/", views.user_groups, name="user_groups"),
    path("group/<int:group_id>/sessions/", views.group_sessions, name="group_sessions"),
]
