from django.http import HttpResponse
from django.template import loader
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from blockbuilders.forms import WalletForm

from blockbuilders.models import Wallet

# Views
@login_required
def home(request):
    if request.method == 'POST':
        form = WalletForm(request.POST or None)

        if form.is_valid():
            form.save()
            wallets = Wallet.objects.all()
            context = {
                "wallets": wallets,
            }
            return render(request, 'home.html', context)
    else:
        wallets = Wallet.objects.all()
        context = {
                "wallets": wallets,
            }
        return render(request, 'home.html', context)

@login_required
def delete_Wallet_by_id(request, wallet_id):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet.delete()
    return redirect("home")

@login_required
def view_wallet(request, wallet_id):
    wallet = Wallet.objects.get(id=wallet_id)
    template = loader.get_template("view_wallet.html")
    context = {
        "wallet": wallet,
    }
    return HttpResponse(template.render(context, request))


def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect("home")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {"form": form})

