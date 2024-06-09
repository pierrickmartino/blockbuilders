import logging

from django.http import HttpRequest

from app.models import UserSetting, User

logger = logging.getLogger("blockbuilders")

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render


@login_required
def profile(request: HttpRequest):
    user = get_object_or_404(User, id=request.user.id)
    user_setting = UserSetting.objects.filter(user=request.user).first()

    context = {
        "user": user,
        "user_setting": user_setting,
    }
    return render(request, "profile.html", context)


@login_required
def update_user_settings(request: HttpRequest):
    if request.method == "POST":
        user_setting, created = UserSetting.objects.get_or_create(user=request.user)
        user_setting.show_positions_above_threshold = "filter_above" in request.POST
        user_setting.show_only_secure_contracts = "filter_secure" in request.POST
        user_setting.save()
        return redirect("profile")

    # Load page normally for GET requests or initial page load
    return render(request, "profile.html", {})
