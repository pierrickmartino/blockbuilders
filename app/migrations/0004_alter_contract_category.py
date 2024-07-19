# Generated by Django 4.2.7 on 2024-07-19 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_transaction_total_cost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contract',
            name='category',
            field=models.CharField(choices=[('standard', 'Standard'), ('fee', 'Fee'), ('suspicious', 'Suspicious'), ('collateral', 'Collateral'), ('stable', 'Stable')], default='standard', max_length=20),
        ),
    ]
