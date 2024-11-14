# Generated by Django 4.2.7 on 2024-11-14 16:18

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('name', models.CharField(max_length=250)),
                ('email', models.CharField(max_length=250, unique=True)),
                ('password', models.CharField(max_length=250)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Blockchain',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(choices=[('Polygon', 'Polygon'), ('BSC', 'BSC'), ('Metis', 'Metis'), ('Arbitrum', 'Arbitrum'), ('Optimism', 'Optimism')], max_length=255, unique=True)),
                ('icon', models.CharField(default='', max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('gecko_id', models.CharField(default='', max_length=255)),
                ('gecko_chain_identifier', models.CharField(default='', max_length=255)),
                ('gecko_name', models.CharField(default='', max_length=255)),
                ('gecko_shortname', models.CharField(default='', max_length=255)),
                ('gecko_native_coin_id', models.CharField(default='', max_length=255)),
                ('transaction_link', models.URLField(max_length=255)),
                ('balance', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('capital_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('unrealized_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('progress_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
            ],
            options={
                'verbose_name': 'Blockchain',
                'verbose_name_plural': 'Blockchains',
            },
        ),
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('symbol', models.CharField(max_length=50)),
                ('relative_symbol', models.CharField(default='', max_length=50)),
                ('address', models.CharField(max_length=255)),
                ('logo_uri', models.CharField(default='', max_length=255)),
                ('decimals', models.IntegerField(default=0)),
                ('price', models.DecimalField(decimal_places=8, default=0, max_digits=15)),
                ('previous_day_price', models.DecimalField(decimal_places=8, default=0, max_digits=15)),
                ('previous_week_price', models.DecimalField(decimal_places=8, default=0, max_digits=15)),
                ('previous_month_price', models.DecimalField(decimal_places=8, default=0, max_digits=15)),
                ('previous_day', models.DateTimeField(default=datetime.datetime.now)),
                ('previous_week', models.DateTimeField(default=datetime.datetime.now)),
                ('previous_month', models.DateTimeField(default=datetime.datetime.now)),
                ('category', models.CharField(choices=[('standard', 'Standard'), ('fee', 'Fee'), ('suspicious', 'Suspicious'), ('collateral', 'Collateral'), ('stable', 'Stable')], default='standard', max_length=20)),
                ('blockchain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contracts', to='app.blockchain')),
            ],
            options={
                'verbose_name': 'Contract',
                'verbose_name_plural': 'Contracts',
            },
        ),
        migrations.CreateModel(
            name='Fiat',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('symbol', models.CharField(max_length=50, unique=True)),
                ('short_symbol', models.CharField(default='', max_length=3)),
                ('exchange_rate', models.DecimalField(decimal_places=8, default=1, max_digits=15)),
            ],
            options={
                'verbose_name': 'Fiat',
                'verbose_name_plural': 'Fiats',
            },
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('quantity', models.DecimalField(decimal_places=18, default=0, max_digits=32)),
                ('average_cost', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('daily_price_delta', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('weekly_price_delta', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('monthly_price_delta', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('progress_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('total_cost', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('unrealized_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('unrealized_gain_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('capital_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='positions', to='app.contract')),
            ],
            options={
                'verbose_name': 'Position',
                'verbose_name_plural': 'Positions',
                'ordering': ['amount'],
            },
        ),
        migrations.CreateModel(
            name='Wallet',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('address', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('balance', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('description', models.TextField(blank=True, default='')),
                ('capital_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('unrealized_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('progress_percentage', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wallets', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Wallet',
                'verbose_name_plural': 'Wallets',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='WalletProcess',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('wallet', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='app.wallet')),
                ('download_task', models.UUIDField(default=uuid.uuid4)),
                ('download_task_date', models.DateTimeField(default=datetime.datetime.now)),
                ('download_task_status', models.CharField(choices=[('waiting', 'Waiting'), ('started', 'Started'), ('finished', 'Finished')], default='waiting', max_length=20)),
                ('resync_task', models.UUIDField(default=uuid.uuid4)),
                ('resync_task_date', models.DateTimeField(default=datetime.datetime.now)),
                ('resync_task_status', models.CharField(choices=[('waiting', 'Waiting'), ('started', 'Started'), ('finished', 'Finished')], default='waiting', max_length=20)),
                ('delete_task', models.UUIDField(default=uuid.uuid4)),
                ('delete_task_date', models.DateTimeField(default=datetime.datetime.now)),
                ('delete_task_status', models.CharField(choices=[('waiting', 'Waiting'), ('started', 'Started'), ('finished', 'Finished')], default='waiting', max_length=20)),
                ('full_download_task', models.UUIDField(default=uuid.uuid4)),
                ('full_download_task_date', models.DateTimeField(default=datetime.datetime.now)),
                ('full_download_task_status', models.CharField(choices=[('waiting', 'Waiting'), ('started', 'Started'), ('finished', 'Finished')], default='waiting', max_length=20)),
            ],
            options={
                'verbose_name': 'Wallet Process',
                'verbose_name_plural': 'Wallets Processes',
            },
        ),
        migrations.CreateModel(
            name='UserSetting',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('show_positions_above_threshold', models.BooleanField(default=False)),
                ('show_only_secure_contracts', models.BooleanField(default=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='settings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Setting',
                'verbose_name_plural': 'User Settings',
            },
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('IN', 'IN'), ('OUT', 'OUT')], max_length=3)),
                ('quantity', models.DecimalField(decimal_places=18, default=0, max_digits=32)),
                ('date', models.DateTimeField(db_index=True)),
                ('comment', models.TextField(blank=True, default='')),
                ('hash', models.CharField(default='', max_length=255)),
                ('price', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('price_contract_based', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('price_fiat_based', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('running_quantity', models.DecimalField(decimal_places=18, default=0, max_digits=32)),
                ('buy_quantity', models.DecimalField(decimal_places=18, default=0, max_digits=32)),
                ('sell_quantity', models.DecimalField(decimal_places=18, default=0, max_digits=32)),
                ('cost', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('cost_contract_based', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('cost_fiat_based', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('total_cost', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('total_cost_contract_based', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('total_cost_fiat_based', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('average_cost', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('average_cost_contract_based', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('average_cost_fiat_based', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('capital_gain', models.DecimalField(decimal_places=2, default=0, max_digits=15)),
                ('against_contract', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='counterpart_transactions', to='app.contract')),
                ('against_fiat', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='counterpart_fiats', to='app.fiat')),
                ('position', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='app.position')),
            ],
            options={
                'verbose_name': 'Transaction',
                'verbose_name_plural': 'Transactions',
                'ordering': ['-date'],
            },
        ),
        migrations.AddField(
            model_name='position',
            name='wallet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='positions', to='app.wallet'),
        ),
        migrations.CreateModel(
            name='MarketData',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('symbol', models.CharField(db_index=True, max_length=50)),
                ('reference', models.CharField(db_index=True, max_length=50)),
                ('time', models.DateTimeField(db_index=True)),
                ('high', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('low', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('open', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('close', models.DecimalField(decimal_places=8, default=0, max_digits=24)),
                ('volume_from', models.DecimalField(decimal_places=4, default=0, max_digits=24)),
                ('volume_to', models.DecimalField(decimal_places=4, default=0, max_digits=24)),
            ],
            options={
                'verbose_name': 'Market Data',
                'verbose_name_plural': 'Market Data',
                'indexes': [models.Index(fields=['symbol', 'reference', 'time'], name='app_marketd_symbol_09b653_idx')],
            },
        ),
        migrations.AddIndex(
            model_name='wallet',
            index=models.Index(fields=['user', 'address'], name='app_wallet_user_id_4c1cad_idx'),
        ),
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['position'], name='app_transac_positio_0c891e_idx'),
        ),
        migrations.AddIndex(
            model_name='position',
            index=models.Index(fields=['wallet', 'contract'], name='app_positio_wallet__6b3077_idx'),
        ),
        migrations.AddIndex(
            model_name='contract',
            index=models.Index(fields=['name', 'symbol'], name='app_contrac_name_b5e74e_idx'),
        ),
    ]
