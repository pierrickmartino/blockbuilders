# Generated by Django 4.2.7 on 2024-04-18 15:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_alter_transaction_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wallet_Process',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('wallet', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='app.wallet')),
                ('download_task', models.UUIDField()),
                ('resync_task', models.UUIDField()),
                ('delete_task', models.UUIDField()),
            ],
            options={
                'verbose_name': 'Wallet Process',
                'verbose_name_plural': 'Wallets Processes',
            },
        ),
    ]
