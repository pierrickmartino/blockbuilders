# Generated by Django 4.2.7 on 2024-06-08 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_alter_contract_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='category',
            field=models.CharField(choices=[('standard', 'Standard'), ('fee', 'Fee'), ('scam', 'Scam'), ('suspicious', 'Suspicious'), ('collateral', 'Collateral')], default='standard', max_length=20),
        ),
    ]
