from django import forms
from .models import MyLabel, MyIngredient


# class LabelForm(forms.ModelForm):
#     """라벨 등록/수정 폼"""
#     frequently_used_texts = forms.ModelChoiceField(
#         queryset=MyIngredient.objects.all(),
#         required=False,
#         label="자주 사용하는 문구",
#         widget=forms.Select(attrs={'class': 'form-select'})
#     )

#     class Meta:
#         model = MyLabel
#         fields = ['content_weight', 'manufacturer_address', 'storage_method']
#         labels = {
#             'content_weight': '내용량 (열량)',
#             'manufacturer_address': '제조원 소재지',
#             'storage_method': '보관방법',
#         }
#         widgets = {
#             'content_weight': forms.TextInput(attrs={'class': 'form-control'}),
#             'manufacturer_address': forms.TextInput(attrs={'class': 'form-control'}),
#             'storage_method': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
#         }

#     def save(self, commit=True):
#         instance = super().save(commit=False)
#         # 자주 사용하는 문구를 선택한 경우 해당 데이터를 storage_method에 추가
#         frequently_used_text = self.cleaned_data.get('frequently_used_texts')
#         if frequently_used_text:
#             instance.storage_method = f"{instance.storage_method}\n{frequently_used_text.text}".strip()
#         if commit:
#             instance.save()
#         return instance


class LabelCreationForm(forms.ModelForm):
    """표시사항 작성 폼"""
    class Meta:
        model = MyLabel
        fields = [
            'my_label_name',
            'prdlst_report_no',
            'prdlst_nm',
            'prdlst_dcnm',
            'bssh_nm',
            'rawmtrl_nm',
            'storage_method',
            'content_weight',
            'manufacturer_address',
            'country_of_origin',
            'importer_address',
            'distributor_name',
            'distributor_address',
            'cautions',
            'additional_info',
        ]
        widgets = {
            'rawmtrl_nm': forms.Textarea(attrs={'rows': 2, 'class': 'auto-expand form-control'}),
            'cautions': forms.Textarea(attrs={'rows': 2, 'class': 'auto-expand form-control'}),
            'additional_info': forms.Textarea(attrs={'rows': 2, 'class': 'auto-expand form-control'}),
        }


class MyIngredientsForm(forms.ModelForm):
    """내 원료 저장 폼"""
    class Meta:
        model = MyIngredient
        fields = [
            'prdlst_report_no', 'prdlst_nm', 'bssh_nm',
            'prms_dt', 'prdlst_dcnm', 'pog_daycnt',
            'frmlc_mtrqlt', 'rawmtrl_nm', 'allergens', 'gmo'  # 필드 추가
        ]
        labels = {
            'prdlst_report_no': '품목제조번호',
            'prdlst_nm': '제품명',
            'bssh_nm': '제조사명',
            'prms_dt': '허가일자',
            'prdlst_dcnm': '식품유형',
            'pog_daycnt': '소비기한',
            'frmlc_mtrqlt': '포장재질',
            'rawmtrl_nm': '원재료명',
            'allergens': '알레르기',  # 레이블 추가
            'gmo': 'GMO'  # 레이블 추가
        }
        widgets = {
            'prdlst_report_no': forms.TextInput(attrs={'readonly': True, 'class': 'form-control'}),
            'prdlst_nm': forms.TextInput(attrs={'readonly': True, 'class': 'form-control'}),
            'bssh_nm': forms.TextInput(attrs={'readonly': True, 'class': 'form-control'}),
            'prms_dt': forms.TextInput(attrs={'readonly': True, 'class': 'form-control'}),
            'prdlst_dcnm': forms.TextInput(attrs={'readonly': True, 'class': 'form-control'}),
            'pog_daycnt': forms.TextInput(attrs={'class': 'form-control'}),
            'frmlc_mtrqlt': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'rawmtrl_nm': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'allergens': forms.Textarea(attrs={'class': 'form-control'}),  # 위젯 추가
            'gmo': forms.TextInput(attrs={'class': 'form-control'})  # 위젯 추가
        }
