# Generated by Django 4.1.7 on 2023-11-09 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_transaction_price_alter_transaction_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='quantity',
            field=models.DecimalField(decimal_places=18, default=0, max_digits=32),
        ),
    ]
