# Generated by Django 5.1.4 on 2025-01-11 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('label', '0002_remove_comment_likers_remove_fooditem_details_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='likers',
        ),
        migrations.RemoveField(
            model_name='fooditem',
            name='details',
        ),
        migrations.RemoveField(
            model_name='fooditem',
            name='manufacturer',
        ),
        migrations.RemoveField(
            model_name='post',
            name='likers',
        ),
        migrations.AddField(
            model_name='post',
            name='api_data',
            field=models.JSONField(blank=True, help_text='API에서 가져온 데이터', null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='is_api_data',
            field=models.BooleanField(default=False, help_text='이 데이터가 API에서 가져온 데이터인지 여부'),
        ),
    ]