# Generated by Django 5.1.4 on 2025-02-20 20:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Allergen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allergen_name', models.CharField(max_length=50, unique=True, verbose_name='알레르기 물질')),
            ],
            options={
                'db_table': 'allergen',
            },
        ),
        migrations.CreateModel(
            name='CountryList',
            fields=[
                ('country_code', models.CharField(blank=True, max_length=3, null=True, verbose_name='국가코드 alpha3')),
                ('country_code2', models.CharField(max_length=2, primary_key=True, serialize=False, verbose_name='국가코드 alpha2')),
                ('numeric_code', models.CharField(blank=True, max_length=3, null=True, verbose_name='국가코드 숫자')),
                ('country_name_en', models.CharField(blank=True, max_length=50, null=True, verbose_name='영문 국가명')),
                ('country_name_ko', models.CharField(blank=True, max_length=50, null=True, verbose_name='한글 국가명')),
            ],
            options={
                'db_table': 'country_list',
                'indexes': [models.Index(fields=['country_code2'], name='idx_country_code2')],
            },
        ),
        migrations.CreateModel(
            name='FoodItem',
            fields=[
                ('lcns_no', models.CharField(blank=True, db_index=True, help_text='영업에 대한 허가, 등록, 신고번호 11자리', max_length=11, null=True, verbose_name='인허가번호')),
                ('bssh_nm', models.CharField(default='기본제조사명', max_length=100, verbose_name='제조사명')),
                ('prdlst_report_no', models.CharField(db_index=True, help_text='영업등록 발급연도-영업장 등록번호-영업장 제품번호', max_length=16, primary_key=True, serialize=False, verbose_name='품목제조번호')),
                ('prms_dt', models.CharField(default='yyyymmdd', help_text='yyyymmdd', max_length=8, verbose_name='허가일자')),
                ('prdlst_nm', models.CharField(db_index=True, default='기본제품명', max_length=200, verbose_name='제품명')),
                ('prdlst_dcnm', models.CharField(default='기본품목유형명', max_length=100, verbose_name='품목유형명')),
                ('production', models.CharField(blank=True, max_length=10, null=True, verbose_name='생산종료여부')),
                ('hieng_lntrt_dvs_yn', models.CharField(blank=True, max_length=10, null=True, verbose_name='고열량저영양식품여부')),
                ('child_crtfc_yn', models.CharField(blank=True, max_length=10, null=True, verbose_name='어린이기호식품품질인증여부')),
                ('pog_daycnt', models.CharField(blank=True, default='기본소비기한', max_length=200, null=True, verbose_name='소비기한')),
                ('last_updt_dtm', models.CharField(blank=True, default='yyyymmdd', max_length=8, null=True, verbose_name='최종수정일자')),
                ('induty_cd_nm', models.CharField(blank=True, default='기본업종명', max_length=80, null=True, verbose_name='업종명')),
                ('qlity_mntnc_tmlmt_daycnt', models.CharField(blank=True, max_length=100, null=True, verbose_name='품질유지기한일수')),
                ('usages', models.TextField(blank=True, max_length=4000, null=True, verbose_name='용법')),
                ('prpos', models.CharField(blank=True, max_length=200, null=True, verbose_name='용도')),
                ('dispos', models.CharField(blank=True, max_length=200, null=True, verbose_name='제품형태')),
                ('frmlc_mtrqlt', models.TextField(blank=True, max_length=300, null=True, verbose_name='포장재질')),
                ('rawmtrl_nm', models.TextField(blank=True, max_length=1000, null=True, verbose_name='원재료명')),
                ('update_datetime', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'food_item',
                'indexes': [models.Index(fields=['lcns_no'], name='idx_lcns_no'), models.Index(fields=['prdlst_report_no'], name='idx_prdlst_report_no'), models.Index(fields=['prdlst_nm'], name='idx_prdlst_nm')],
            },
        ),
        migrations.CreateModel(
            name='FoodType',
            fields=[
                ('prdlst_dcnm', models.CharField(db_index=True, max_length=100, primary_key=True, serialize=False, verbose_name='식품유형')),
            ],
            options={
                'db_table': 'Food_Type',
                'indexes': [models.Index(fields=['prdlst_dcnm'], name='idx_prdlst_dcnm')],
            },
        ),
        migrations.CreateModel(
            name='MyIngredient',
            fields=[
                ('my_ingredient_id', models.AutoField(primary_key=True, serialize=False)),
                ('my_ingredient_name', models.CharField(max_length=200, verbose_name='내 원료명')),
                ('prdlst_report_no', models.CharField(blank=True, max_length=16, null=True, verbose_name='품목제조번호')),
                ('prdlst_nm', models.CharField(max_length=200, verbose_name='제품명')),
                ('bssh_nm', models.CharField(max_length=100, verbose_name='제조사명')),
                ('prms_dt', models.CharField(blank=True, max_length=8, null=True, verbose_name='허가일자')),
                ('prdlst_dcnm', models.CharField(blank=True, max_length=100, null=True, verbose_name='식품유형')),
                ('pog_daycnt', models.CharField(blank=True, max_length=200, null=True, verbose_name='소비기한')),
                ('frmlc_mtrqlt', models.TextField(blank=True, max_length=300, null=True, verbose_name='포장재질')),
                ('rawmtrl_nm', models.TextField(blank=True, max_length=1000, null=True, verbose_name='원재료명')),
                ('induty_cd_nm', models.CharField(blank=True, max_length=80, null=True, verbose_name='업종명')),
                ('hieng_lntrt_dvs_yn', models.CharField(blank=True, max_length=10, null=True, verbose_name='고열량저영양식품여부')),
                ('ingredient_ratio', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='원료 비율(%)')),
                ('ingredient_display_name', models.CharField(blank=True, max_length=200, null=True, verbose_name='원료 표시명')),
                ('search_name', models.CharField(max_length=200, unique=True, verbose_name='검색 이름')),
                ('update_datetime', models.DateTimeField(auto_now=True)),
                ('delete_datetime', models.CharField(default='', help_text='yyyymmdd', max_length=8, verbose_name='삭제일자')),
                ('delete_YN', models.CharField(max_length=1, verbose_name='내 제품 삭제 여부')),
                ('user_id', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, related_name='user_ingredient', to=settings.AUTH_USER_MODEL, verbose_name='사용자 id')),
            ],
            options={
                'db_table': 'my_ingredient',
            },
        ),
        migrations.CreateModel(
            name='LabelIngredientRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prdlst_nm', models.CharField(blank=True, max_length=200, null=True, verbose_name='제품명')),
                ('prdlst_report_no', models.CharField(blank=True, max_length=16, null=True, verbose_name='품목제조번호')),
                ('ingredient_ratio', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='원료 비율(%)')),
                ('prdlst_dcnm', models.CharField(blank=True, db_index=True, max_length=100, null=True, verbose_name='식품유형')),
                ('country_of_origin', models.CharField(blank=True, max_length=255, null=True, verbose_name='원산지')),
                ('ingredient_display_name', models.CharField(blank=True, max_length=200, null=True, verbose_name='원료 표시명')),
                ('allergen', models.CharField(blank=True, max_length=200, null=True, verbose_name='알레르기 물질')),
                ('gmo', models.CharField(blank=True, max_length=200, null=True, verbose_name='GMO 여부')),
                ('bssh_nm', models.CharField(blank=True, max_length=100, null=True, verbose_name='제조사명')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='label_relations', to='label.myingredient')),
            ],
            options={
                'verbose_name': '라벨-원료 관계',
                'verbose_name_plural': '라벨-원료 관계들',
                'db_table': 'label_ingredient_relation',
                'ordering': ['ingredient_ratio'],
            },
        ),
        migrations.CreateModel(
            name='MyLabel',
            fields=[
                ('my_label_id', models.AutoField(primary_key=True, serialize=False)),
                ('my_label_name', models.CharField(max_length=200, verbose_name='라벨명')),
                ('prdlst_report_no', models.CharField(blank=True, max_length=16, null=True, verbose_name='품목제조번호')),
                ('prdlst_nm', models.CharField(blank=True, max_length=200, null=True, verbose_name='제품명')),
                ('prdlst_dcnm', models.CharField(blank=True, max_length=100, null=True, verbose_name='품목유형명')),
                ('bssh_nm', models.CharField(blank=True, max_length=100, null=True, verbose_name='제조사명')),
                ('rawmtrl_nm', models.TextField(blank=True, max_length=1000, null=True, verbose_name='원재료명')),
                ('storage_method', models.TextField(blank=True, null=True, verbose_name='보관방법')),
                ('content_weight', models.CharField(blank=True, max_length=50, null=True, verbose_name='내용량(열량)')),
                ('manufacturer_address', models.CharField(blank=True, max_length=255, null=True, verbose_name='제조원 소재지')),
                ('country_of_origin', models.CharField(blank=True, max_length=255, null=True, verbose_name='원산지')),
                ('importer_address', models.CharField(blank=True, max_length=255, null=True, verbose_name='수입원 및 소재지')),
                ('distributor_name', models.CharField(blank=True, max_length=200, null=True, verbose_name='유통전문판매원')),
                ('distributor_address', models.CharField(blank=True, max_length=255, null=True, verbose_name='유통전문판매원 소재지')),
                ('cautions', models.TextField(blank=True, null=True, verbose_name='주의사항')),
                ('additional_info', models.TextField(blank=True, null=True, verbose_name='기타 표시사항')),
                ('create_datetime', models.DateTimeField(auto_now_add=True)),
                ('update_datetime', models.DateTimeField(auto_now=True)),
                ('label_create_YN', models.CharField(default='N', max_length=1, verbose_name='표시 사항 작성 여부')),
                ('ingredient_create_YN', models.CharField(default='N', max_length=1, verbose_name='원재료 작성 여부')),
                ('delete_datetime', models.CharField(default='', help_text='yyyymmdd', max_length=8, verbose_name='삭제일자')),
                ('delete_YN', models.CharField(default='N', max_length=1, verbose_name='내 제품 삭제 여부')),
                ('ingredient_ids_str', models.CharField(blank=True, help_text='쉼표(,)로 구분', max_length=1000, null=True, verbose_name='원재료 ID 목록')),
                ('ingredients', models.ManyToManyField(related_name='labels', through='label.LabelIngredientRelation', to='label.myingredient', verbose_name='연결된 원재료')),
                ('user_id', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, related_name='user_label', to=settings.AUTH_USER_MODEL, verbose_name='사용자 id')),
            ],
            options={
                'db_table': 'my_label',
            },
        ),
        migrations.AddField(
            model_name='labelingredientrelation',
            name='label',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ingredient_relations', to='label.mylabel'),
        ),
        migrations.CreateModel(
            name='MyPhrase',
            fields=[
                ('my_phrase_id', models.AutoField(primary_key=True, serialize=False)),
                ('my_phrase_name', models.CharField(max_length=200, verbose_name='내 문구명')),
                ('category_name', models.CharField(max_length=100, verbose_name='문구 카테고리')),
                ('comment_content', models.TextField(max_length=1000, verbose_name='문구 내용')),
                ('update_datetime', models.DateTimeField(auto_now=True)),
                ('delete_datetime', models.CharField(default='', help_text='yyyymmdd', max_length=8, verbose_name='삭제일자')),
                ('delete_YN', models.CharField(max_length=1, verbose_name='내 제품 삭제 여부')),
                ('user_id', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, related_name='user_phrase', to=settings.AUTH_USER_MODEL, verbose_name='사용자 id')),
            ],
            options={
                'db_table': 'my_comment_storage',
            },
        ),
        migrations.AlterUniqueTogether(
            name='labelingredientrelation',
            unique_together={('label', 'ingredient')},
        ),
    ]
