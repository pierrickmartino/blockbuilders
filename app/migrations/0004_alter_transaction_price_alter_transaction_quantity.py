# Generated by Django 4.1.7 on 2023-11-09 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_alter_position_contract_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='price',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=15),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='quantity',
            field=models.DecimalField(decimal_places=8, default=0, max_digits=18),
        ),
    ]
