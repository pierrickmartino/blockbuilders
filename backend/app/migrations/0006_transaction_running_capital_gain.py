# Generated by Django 4.2.7 on 2025-05-18 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_blockchain_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='running_capital_gain',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
    ]
