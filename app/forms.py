from django import forms
from .models import Contract, Wallet


class WalletForm(forms.ModelForm):
    class Meta:
        model = Wallet
        fields = ['address','name']

class ContractForm(forms.ModelForm):
    class Meta:
        model = Contract
        fields = ['address']