# Generated by Django 4.1.7 on 2023-11-20 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_transaction_capital_gain_contract_based_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='blockchain',
            name='gecko_chain_identifier',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='blockchain',
            name='gecko_id',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='blockchain',
            name='gecko_name',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='blockchain',
            name='gecko_native_coin_id',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='blockchain',
            name='gecko_shortname',
            field=models.CharField(default='', max_length=255),
        ),
    ]
