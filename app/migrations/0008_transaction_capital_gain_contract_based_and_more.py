# Generated by Django 4.1.7 on 2023-11-15 15:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("app", "0007_transaction_avg_cost_contract_based_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="capital_gain_contract_based",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
        migrations.AddField(
            model_name="transaction",
            name="capital_gain_percentage_contract_based",
            field=models.DecimalField(decimal_places=8, default=0, max_digits=15),
        ),
    ]
