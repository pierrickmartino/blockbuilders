# Generated by Django 4.2.7 on 2024-07-09 09:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blockchain',
            name='transaction_link',
            field=models.URLField(default='http://', max_length=255),
            preserve_default=False,
        ),
    ]
