# Generated by Django 5.1.4 on 2025-01-29 09:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0007_labelorder'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Allergen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='알레르기 물질')),
            ],
        ),
        migrations.RemoveField(
            model_name='label',
            name='qlity_mntnc_tmlmt_daycnt',
        ),
        migrations.RemoveField(
            model_name='myproduct',
            name='dispos',
        ),
        migrations.RemoveField(
            model_name='myproduct',
            name='prpos',
        ),
        migrations.AddField(
            model_name='label',
            name='importer_address',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='수입원 및 소재지'),
        ),
        migrations.AddField(
            model_name='label',
            name='origin',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='원산지'),
        ),
        migrations.AddField(
            model_name='myproduct',
            name='importer_address',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='수입원 및 소재지'),
        ),
        migrations.AddField(
            model_name='myproduct',
            name='origin',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='원산지'),
        ),
        migrations.AlterField(
            model_name='labelorder',
            name='order',
            field=models.TextField(verbose_name='필드 순서 (JSON 형식)'),
        ),
        migrations.AlterField(
            model_name='labelorder',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='labelorder',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='label',
            name='allergens',
            field=models.ManyToManyField(blank=True, to='label.allergen', verbose_name='알레르기 물질'),
        ),
    ]
