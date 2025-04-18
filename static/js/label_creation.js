// 전역 데이터 초기화
let phrasesData = {};
let regulations = {};
let lastFocusedFieldName = null;
let phraseInsertMode = 'append';

// DOMContentLoaded 이벤트로 초기화 보장
document.addEventListener('DOMContentLoaded', function () {
  // 데이터 초기화
  try {
    phrasesData = JSON.parse(document.getElementById('phrases-data')?.textContent || '{}');
    regulations = JSON.parse(document.getElementById('regulations-data')?.textContent || '{}');
  } catch (e) {
    console.error('데이터 파싱 오류:', e);
  }

  // ------------------ 공통 유틸리티 함수 ------------------
  function adjustHeight(element, maxHeight = Infinity) {
    if (!element) return;
    element.style.height = 'auto';  // 기본 높이 제거
    const scrollHeight = element.scrollHeight + 2;
    element.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }

  function adjustRegulationBoxHeight(textarea) {
    const container = document.getElementById('regulation-content');
    if (!container || !textarea) return;
    textarea.style.height = 'auto';
    const tabContent = container.closest('.tab-content');
    const maxHeight = tabContent ? tabContent.clientHeight * 0.9 : window.innerHeight * 0.6;
    const scrollHeight = textarea.scrollHeight + 10;
    container.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    container.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    textarea.style.height = '100%';
    textarea.style.resize = 'none';
  }

  window.updateTextareaHeight = function (textarea) {
    if (!textarea) return;
    const isRegulation = textarea.name === 'related_regulations';
    adjustHeight(textarea, isRegulation ? Infinity : 200);  // 일반 항목도 최대 200px까지는 허용
    if (isRegulation) {
      adjustRegulationBoxHeight(textarea);
    }
  };

  function initAutoExpand() {
    document.querySelectorAll('textarea.form-control, textarea.auto-expand').forEach(textarea => {
      updateTextareaHeight(textarea);
      if (textarea.name !== 'related_regulations') {
        textarea.addEventListener('input', () => updateTextareaHeight(textarea));
        textarea.addEventListener('change', () => updateTextareaHeight(textarea));
      }
    });

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            node.querySelectorAll('textarea.form-control, textarea.auto-expand').forEach(updateTextareaHeight);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ------------------ 라벨 관리 기능 ------------------
  window.copyLabel = function (labelId) {
    if (!labelId) return alert('복사할 라벨이 없습니다.');
    if (confirm('현재 라벨을 복사하시겠습니까?')) {
      window.location.href = `/label/duplicate/${labelId}/`;
    }
  };

  window.deleteLabel = function (labelId) {
    if (!labelId) return alert('삭제할 라벨이 없습니다.');
    if (confirm('정말로 이 라벨을 삭제하시겠습니까? 복구할 수 없습니다.')) {
      window.location.href = `/label/delete/${labelId}/`;
    }
  };

  // ------------------ 팝업 로직 ------------------
  window.openPopup = function (url, name, width = 1100, height = 900) {
    console.log(`팝업 열기 시도: url=${url}, name=${name}, width=${width}, height=${height}`);
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const popup = window.open(url, name, `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
    if (!popup) {
      alert('팝업이 차단되었습니다. 브라우저의 팝업 차단 설정을 확인해 주세요.');
    }
    return popup;
  };

  window.handleIngredientPopup = function () {
    const rawmtrlNmDisplay = document.querySelector('textarea[name="rawmtrl_nm_display"]')?.value || '';
    const labelId = document.getElementById('label_id')?.value || '';
    console.log(`원재료명 팝업: rawmtrlNmDisplay=${rawmtrlNmDisplay}, labelId=${labelId}`);
    openPopup(`/label/ingredient-popup/?rawmtrl_nm_display=${encodeURIComponent(rawmtrlNmDisplay)}&label_id=${labelId}`, 'IngredientPopup', 1400, 900);

    const rawmtrlSection = document.getElementById('rawmtrl_nm_section');
    if (rawmtrlSection?.classList.contains('collapse')) {
      console.log('원재료명 섹션 펼침');
      rawmtrlSection.classList.add('show');
    }
  };

  window.openNutritionCalculator = function () {
    const labelId = document.getElementById('label_id')?.value || '';
    console.log(`영양성분 계산기 팝업: labelId=${labelId}`);
    openPopup(`/label/nutrition-calculator-popup/?label_id=${labelId}`, 'NutritionCalculator', 1100, 900);
  };

  window.openPhrasePopup = function () {
    console.log('내문구 관리 팝업');
    openPopup('/label/phrases/', 'phrasePopup', 1100, 900);
  };

  window.openPreviewPopup = function () {
    const labelId = document.getElementById('label_id')?.value;
    if (!labelId) return alert('라벨이 저장되지 않았습니다.');
    const queryString = new URLSearchParams();
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(chk => queryString.append(chk.name, 'true'));
    openPopup(`/label/preview/?label_id=${labelId}&${queryString.toString()}`, 'previewPopup', 1400, 900);
  };

  window.addEventListener('message', function (e) {
    if (e.data.type !== 'applyPhrases') return;
    console.log('문구 적용 메시지 수신:', e.data);
    const phrases = e.data.phrases;
    const categoryMapping = {
      storage: 'storage_method',
      package: 'frmlc_mtrqlt',
      manufacturer: 'bssh_nm',
      distributor: 'distributor_address',
      repacker: 'repacker_address',
      importer: 'importer_address',
      expiry: 'pog_daycnt',
      cautions: 'cautions',
      additional: 'additional_info'
    };

    Object.keys(phrases).forEach(category => {
      const mappedCategory = categoryMapping[category] || category;
      const textarea = document.querySelector(`textarea[name="${mappedCategory}"]`);
      if (textarea && phrases[category]?.length) {
        textarea.value = phrases[category].map(p => p.content).join('\n');
        updateTextareaHeight(textarea);
        console.log(`문구 적용: ${mappedCategory}`);
      }
    });
  });

  // ------------------ 체크박스 그룹 초기화 ------------------
  function initCheckBoxGroups() {
    $('.grp-long-shelf').on('change', function () {
      if (this.checked) {
        $('.grp-long-shelf').not(this).prop('checked', false).data('alreadyChecked', false);
        $(this).data('alreadyChecked', true);
        $('#hidden_preservation_type').val(this.value);
      } else {
        $(this).data('alreadyChecked', false);
        $('#hidden_preservation_type').val('');
      }
      updateSummary();
    });

    $('.grp-sterilization').on('change', function () {
      if (this.id === 'chk_sterilization_other') return;
      if (this.checked) {
        $('.grp-sterilization').not('#chk_sterilization_other').not(this)
          .prop('checked', false).data('alreadyChecked', false);
        $(this).data('alreadyChecked', true);
        $('#hidden_processing_method').val(this.value);
      } else {
        $(this).data('alreadyChecked', false);
        $('#hidden_processing_method').val('');
      }
      updateSterilizationOther();
      updateSummary();
    });

    $('#chk_sterilization_other').on('change', function () {
      console.log('chk_sterilization_other 변경:', this.checked);
      updateSummary();
      const conditionInput = $('input[name="processing_condition"]');
      conditionInput.prop('disabled', !this.checked);
      if (!this.checked) {
        conditionInput.val('');
        $('#hidden_processing_condition').val('');
      }
      updateSummary();
    });

    $('input[name="processing_condition"]').on('input change', function () {
      const value = this.value.trim();
      console.log('processing_condition 입력:', value);
      $('#hidden_processing_condition').val(value);
      if ($('#chk_sterilization_other').is(':checked')) {
        updateSummary();
      }
    });

    function updateSterilizationOther() {
      const isActive = $('#chk_sanitized').is(':checked') || $('#chk_aseptic').is(':checked');
      console.log('updateSterilizationOther:', isActive);
      $('#chk_sterilization_other').prop('disabled', !isActive).prop('checked', isActive ? $('#chk_sterilization_other').prop('checked') : false);
      if (!isActive) {
        $('input[name="processing_condition"], #hidden_processing_condition').val('');
        updateSummary();
      }
    }
  }

  function initSingleSelectGroup(selector, exceptionId = null) {
    $(selector).on('click', function (e) {
      if (this.id === exceptionId) return;
      const alreadyChecked = $(this).data('alreadyChecked') || false;
      $(selector).not(this).prop('checked', false).data('alreadyChecked', false);
      $(this).prop('checked', !alreadyChecked).data('alreadyChecked', !alreadyChecked);
      e.stopPropagation();
    });
  }

  function getCheckedLabel(selector) {
    const checked = $(selector).filter(':checked');
    return checked.length ? $(`label[for="${checked.attr('id')}"]`).text() || null : null;
  }

  // ------------------ 식품유형 요약 업데이트 ------------------
  function updateSummary() {
    console.log('updateSummary 호출');
    const summaries = [];
    const foodSmall = $('#food_type option:selected').text();
    if (foodSmall && foodSmall !== '소분류') {
      console.log('소분류 추가:', foodSmall);
      summaries.push(foodSmall);
    }

    const longShelfId = $('.grp-long-shelf:checked').attr('id');
    let isFrozenHeated = false;
    if (longShelfId === 'chk_frozen_heated') {
      summaries.push('가열하여 섭취하는 냉동식품');
      isFrozenHeated = true;
      console.log('장기보존: 냉동(가열)');
    } else if (longShelfId === 'chk_frozen_nonheated') {
      summaries.push('가열하지 않고 섭취하는 냉동식품');
      console.log('장기보존: 냉동(비가열)');
    } else if (longShelfId === 'chk_canned') {
      summaries.push('통.병조림');
      console.log('장기보존: 통.병조림');
    } else if (longShelfId === 'chk_retort') {
      summaries.push('레토르트식품');
      console.log('장기보존: 레토르트');
    }

    const methodLabels = {
      chk_sanitized: '살균제품',
      chk_aseptic: '멸균제품',
      chk_yutang: '유탕.유처리제품'
    };
    let methodChecked = false;
    $('.grp-sterilization:checked').each(function () {
      const methodId = $(this).attr('id');
      if (methodLabels[methodId]) {
        summaries.push(methodLabels[methodId]);
        methodChecked = true;
        console.log('제조방법 추가:', methodLabels[methodId]);
      }
    });

    if ($('#chk_sterilization_other').is(':checked')) {
      const conditionValue = $('input[name="processing_condition"]').val()?.trim();
      if (conditionValue) {
        summaries.push(conditionValue);
        methodChecked = true;
        console.log('조건 추가:', conditionValue);
      }
    }

    if (isFrozenHeated && !methodChecked) {
      summaries.push('비살균제품');
      console.log('비살균제품 추가');
    }

    const summaryText = '식품유형 : ' + (summaries.length ? summaries.join(' | ') : '');
    console.log('최종 요약:', summaryText);
    $('#selected-info').text(summaryText);
  }

  // ------------------ 토글 버튼 초기화 ------------------
  function initToggleButtons() {
    const toggles = [
      {
        btn: 'toggleFoodTypeBtn',
        section: 'food-type-section',
        showText: '∧',
        hideText: '∨',
        showTitle: '접기',
        hideTitle: '펼치기',
        toggleFn: (section, isHidden) => (section.style.display = isHidden ? 'block' : 'none')
      },
      {
        btn: 'toggleRegulationBtn',
        section: 'regulationPanel',
        showText: '❮',
        hideText: '❯',
        showTitle: '펼치기',
        hideTitle: '접기',
        toggleFn: (section, isHidden) => section.classList.toggle('collapsed', !isHidden)
      },
      {
        btn: 'toggleManufacturerBtn',
        section: 'other-manufacturers',
        showText: '∧',
        hideText: '∨',
        showTitle: '접기',
        hideTitle: '펼치기',
        toggleFn: null // Bootstrap collapse 사용
      }
    ];

    toggles.forEach(({ btn, section, showText, hideText, showTitle, hideTitle, toggleFn }) => {
      const btnEl = document.getElementById(btn);
      const sectionEl = document.getElementById(section);
      if (!btnEl || !sectionEl) return;

      if (toggleFn) {
        btnEl.addEventListener('click', () => {
          const isHidden = sectionEl.style.display === 'none' || sectionEl.classList.contains('collapsed');
          toggleFn(sectionEl, isHidden);
          btnEl.innerText = isHidden ? showText : hideText;
          btnEl.setAttribute('title', isHidden ? showTitle : hideTitle);
        });
      } else {
        sectionEl.addEventListener('shown.bs.collapse', () => {
          btnEl.innerText = showText;
          btnEl.setAttribute('title', showTitle);
        });
        sectionEl.addEventListener('hidden.bs.collapse', () => {
          btnEl.innerText = hideText;
          btnEl.setAttribute('title', hideTitle);
        });
      }
    });
  }

  // ------------------ 영양성분 데이터 처리 ------------------
  function updateNutritionFields(data) {
    if (!data) return;
    const fieldMap = {
      serving_size: 'serving_size',
      serving_size_unit: 'serving_size_unit',
      units_per_package: 'units_per_package',
      nutrition_display_unit: 'nutrition_display_unit',
      calories: 'calories',
      calories_unit: 'calories_unit',
      natriums: 'natriums',
      natriums_unit: 'natriums_unit',
      carbohydrates: 'carbohydrates',
      carbohydrates_unit: 'carbohydrates_unit',
      sugars: 'sugars',
      sugars_unit: 'sugars_unit',
      fats: 'fats',
      fats_unit: 'fats_unit',
      trans_fats: 'trans_fats',
      trans_fats_unit: 'trans_fats_unit',
      saturated_fats: 'saturated_fats',
      saturated_fats_unit: 'saturated_fats_unit',
      cholesterols: 'cholesterols',
      cholesterols_unit: 'cholesterols_unit',
      proteins: 'proteins',
      proteins_unit: 'proteins_unit'
    };

    Object.keys(fieldMap).forEach(key => {
      const field = document.querySelector(`input[name="${fieldMap[key]}"]`);
      if (field && data[key] !== undefined) field.value = data[key];
    });
  }

  // ------------------ 식품유형 대분류-소분류 연동 ------------------
  function initFoodTypeFiltering() {
    const foodGroup = $('#food_group');
    const foodType = $('#food_type');
    const hiddenFoodGroup = $('#hidden_food_group');
    const hiddenFoodType = $('#hidden_food_type');
  
    function updateHiddenFields() {
      hiddenFoodGroup.val(foodGroup.val());
      hiddenFoodType.val(foodType.val());
    }
  
    function updateFoodTypes(group, currentType) {
      console.log(`updateFoodTypes 호출: group=${group}, currentType=${currentType}`);
      foodType.empty().append('<option value="">소분류</option>');
      const url = group ? `/label/food-types-by-group/?group=${encodeURIComponent(group)}` : '/label/food-types/';
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('소분류 데이터:', data.food_types);
            data.food_types.forEach(item => {
              const option = new Option(item.food_type, item.food_type);
              option.dataset.group = item.food_group;
              foodType.append(option);
            });
            foodType.val(currentType && data.food_types.some(t => t.food_type === currentType) ? currentType : null).trigger('change.select2');
          } else {
            console.error('소분류 데이터 로드 실패:', data);
          }
        })
        .catch(error => console.error('소분류 데이터 로딩 중 오류:', error));
    }
  
    foodGroup.on('change', function () {
      const group = this.value;
      console.log(`대분류 변경: ${group}`);
      updateHiddenFields();
      updateFoodTypes(group, foodType.val());
      updateSummary();
    });
  
    foodType.on('change', function () {
      const selectedOption = this.options[this.selectedIndex];
      const foodTypeValue = selectedOption?.value;
      console.log(`소분류 변경: ${foodTypeValue}`);
      updateHiddenFields();
      if (foodTypeValue) {
        const group = selectedOption.dataset.group;
        if (group && foodGroup.val() !== group) {
          console.log(`대분류 자동 설정: ${group}`);
          foodGroup.val(group).trigger('change.select2');
          hiddenFoodGroup.val(group);
        } else if (!group) {
          console.log('대분류 조회 시작:', foodTypeValue);
          fetch(`/label/get-food-group/?food_type=${encodeURIComponent(foodTypeValue)}`)
            .then(response => response.json())
            .then(data => {
              if (data.success && data.food_group) {
                console.log(`대분류 조회 성공: ${data.food_group}`);
                foodGroup.val(data.food_group).trigger('change.select2');
                hiddenFoodGroup.val(data.food_group);
                selectedOption.dataset.group = data.food_group;
              } else {
                console.warn('대분류 없음:', foodTypeValue);
              }
            })
            .catch(error => console.error('대분류 조회 중 오류:', error));
        }
        updateCheckboxesByFoodType(foodTypeValue);
      }
      updateSummary();
    });
  
    // 초기화: 대분류가 없으면 모든 소분류 로드
    updateHiddenFields();
    const initialFoodType = foodType.val();
    const initialFoodGroup = foodGroup.val();
    console.log(`초기화: foodType=${initialFoodType}, foodGroup=${initialFoodGroup}`);
    if (initialFoodType) {
      const group = foodType.find('option:selected').data('group');
      if (group) {
        console.log(`초기 대분류 설정: ${group}`);
        foodGroup.val(group).trigger('change.select2');
        hiddenFoodGroup.val(group);
        updateCheckboxesByFoodType(initialFoodType);
      } else {
        console.log('초기 대분류 조회:', initialFoodType);
        fetch(`/label/get-food-group/?food_type=${encodeURIComponent(initialFoodType)}`)
          .then(response => response.json())
          .then(data => {
            if (data.success && data.food_group) {
              console.log(`초기 대분류 설정: ${data.food_group}`);
              foodGroup.val(data.food_group).trigger('change.select2');
              hiddenFoodGroup.val(data.food_group);
              updateCheckboxesByFoodType(initialFoodType);
            }
          })
          .catch(error => console.error('초기 대분류 조회 중 오류:', error));
      }
    } else {
      console.log('초기 모든 소분류 로드');
      updateFoodTypes('', initialFoodType); // 대분류 없이 모든 소분류 로드
      setDefaultCheckboxes();
    }
  }

  function updateCheckboxesByFoodType(foodType) {
    if (!foodType) return Promise.resolve();
    console.log(`체크박스 업데이트 시작: foodType=${foodType}`);
    return fetch(`/label/food-type-settings/?food_type=${encodeURIComponent(foodType)}`)
      .then(response => response.json())
      .then(data => {
        if (!data.success || !data.settings) {
          console.error('API 응답 오류:', data);
          return;
        }
        console.log('API 응답 데이터:', data.settings);
        const settings = data.settings;
        const fieldMappings = {
          prdlst_dcnm: 'chk_prdlst_dcnm',
          rawmtrl_nm: 'chk_rawmtrl_nm_display',
          nutritions: 'chk_calories',
          prdlst_nm: 'chk_prdlst_nm',
          ingredients_info: 'chk_ingredients_info',
          content_weight: 'chk_content_weight',
          weight_calorie: 'chk_weight_calorie',
          prdlst_report_no: 'chk_prdlst_report_no',
          country_of_origin: 'chk_country_of_origin',
          storage_method: 'chk_storage_method',
          frmlc_mtrqlt: 'chk_frmlc_mtrqlt',
          manufacturer_info: 'chk_manufacturer_info',
          distributor_address: 'chk_distributor_address',
          repacker_address: 'chk_repacker_address',
          importer_address: 'chk_importer_address',
          date_info: 'chk_date_info',
          cautions: 'chk_cautions',
          additional_info: 'chk_additional_info'
        };

        Object.keys(settings).forEach(field => {
          const value = settings[field];
          const checkboxId = fieldMappings[field] || `chk_${field}`;
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            console.log(`체크박스 처리: ${checkboxId}, value=${value}`);
            checkbox.checked = value === 'Y';
            checkbox.disabled = value === 'D';
            checkbox.dataset.forcedDisabled = value === 'D' ? 'true' : 'false';
            checkbox.dispatchEvent(new Event('change'));
          } else {
            console.warn(`체크박스 없음: ${checkboxId}`);
          }
          if (field === 'pog_daycnt') {
            console.log(`pog_daycnt 처리: ${settings.pog_daycnt}`);
            updateDateDropdown(settings.pog_daycnt);
          }
        });

        if (settings.pog_daycnt_options !== undefined) {
          console.log('pog_daycnt_options 처리:', settings.pog_daycnt_options);
          updateDateDropdownOptions(settings.pog_daycnt_options);
        }
        if (settings.relevant_regulations !== undefined) {
          const textarea = document.querySelector('textarea[name="related_regulations"]');
          if (textarea) {
            console.log('relevant_regulations 설정:', settings.relevant_regulations);
            textarea.value = settings.relevant_regulations;
            updateTextareaHeight(textarea);
          }
        }
      })
      .catch(error => console.error('체크박스 설정 로딩 중 오류:', error));
  }

  function updateDateDropdown(value) {
    const dateOptions = document.querySelector('select[name="date_option"]');
    if (!dateOptions) return;
    console.log(`updateDateDropdown: value=${value}`);
    dateOptions.disabled = value === 'D';
    Array.from(dateOptions.options).forEach(option => (option.disabled = value === 'D'));
    if (value === 'D') dateOptions.value = '';
  }

  function updateDateDropdownOptions(options) {
    const dateOptions = document.querySelector('select[name="date_option"]');
    if (!dateOptions) return;
    const currentValue = dateOptions.value;
    if (!dateOptions.dataset.originalOptions) dateOptions.dataset.originalOptions = dateOptions.innerHTML;

    console.log(`updateDateDropdownOptions: options=${options}`);
    dateOptions.innerHTML = '';
    if (options?.length) {
      options.forEach(option => {
        if (option) dateOptions.append(new Option(option, option));
      });
      dateOptions.value = options.includes(currentValue) ? currentValue : options[0] || '';
    } else {
      dateOptions.innerHTML = dateOptions.dataset.originalOptions || '';
    }
    dateOptions.disabled = false;
  }

  // ------------------ 체크박스 필드 토글 ------------------
  function initCheckboxFieldToggle() {
    const fieldMappings = {
      label_nm: ['input[name="my_label_name"]'],
      prdlst_dcnm: ['input[name="prdlst_dcnm"]'],
      prdlst_nm: ['input[name="prdlst_nm"]'],
      ingredients_info: ['input[name="ingredient_info"]'],
      content_weight: ['input[name="content_weight"]'],
      weight_calorie: ['input[name="weight_calorie"]'],
      prdlst_report_no: ['input[name="prdlst_report_no"]'],
      country_of_origin: ['select[name="country_of_origin"]'],
      storage_method: ['input[name="storage_method"]'],
      frmlc_mtrqlt: ['input[name="frmlc_mtrqlt"]'],
      manufacturer_info: ['input[name="bssh_nm"]'],
      distributor_address: ['input[name="distributor_address"]'],
      repacker_address: ['input[name="repacker_address"]'],
      importer_address: ['input[name="importer_address"]'],
      date_info: ['input[name="pog_daycnt"]', 'select[name="date_option"]'],
      rawmtrl_nm_display: ['textarea[name="rawmtrl_nm_display"]'],
      rawmtrl_nm: ['textarea[name="rawmtrl_nm"]'],
      cautions: ['textarea[name="cautions"]'],
      additional_info: ['textarea[name="additional_info"]'],
      calories: ['textarea[name="nutrition_text"]']
    };

    document.querySelectorAll('input[type="checkbox"][id^="chk_"]').forEach(checkbox => {
      if (checkbox.dataset.initialized === 'true') return;
      checkbox.dataset.initialized = 'true';

      const fieldName = checkbox.id.replace('chk_', '');
      if (fieldName === 'rawmtrl_nm') {
        console.log('rawmtrl_nm 체크박스 비활성화');
        checkbox.disabled = true;
        const textarea = document.querySelector('textarea[name="rawmtrl_nm"]');
        if (textarea) {
          textarea.disabled = true;
          textarea.classList.add('disabled-textarea');
        }
        return;
      }

      const relatedFields = fieldMappings[fieldName]?.map(sel => document.querySelector(sel)).filter(Boolean) || [];
      if (!relatedFields.length) {
        console.warn(`관련 필드 없음: ${fieldName}`);
        return;
      }

      function updateFields() {
        console.log(`updateFields 호출: ${checkbox.id}, forcedDisabled=${checkbox.dataset.forcedDisabled}`);
        relatedFields.forEach(field => {
          field.disabled = checkbox.dataset.forcedDisabled === 'true';
          field.classList.toggle('disabled-textarea', field.disabled);
        });
      }

      checkbox.addEventListener('change', updateFields);
      updateFields();
    });
  }

  function setDefaultCheckboxes() {
    const labelId = $('#label_id').val();
    const foodType = $('#food_type').val();
    if (labelId || foodType) {
      console.log('setDefaultCheckboxes 스킵: labelId 또는 foodType 존재');
      return;
    }
    const defaults = {
      chk_prdlst_nm: true,
      chk_content_weight: true,
      chk_manufacturer_info: true,
      chk_date_info: true,
      chk_label_nm: false,
      chk_ingredients_info: false,
      chk_distributor_address: false,
      chk_repacker_address: false,
      chk_importer_address: false,
      chk_rawmtrl_nm: false
    };

    console.log('setDefaultCheckboxes 실행');
    Object.keys(defaults).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox && !checkbox.disabled) {
        checkbox.checked = defaults[id];
        checkbox.dispatchEvent(new Event('change'));
        console.log(`기본값 설정: ${id}=${defaults[id]}`);
      }
    });
  }

  function prepareFormData() {
    $('input[type="checkbox"]').each(function () {
      const name = $(this).attr('name');
      if (name?.startsWith('chk_')) {
        let hiddenField = $(`input[type="hidden"][name="${name}"]`);
        if (!hiddenField.length) {
          hiddenField = $('<input>').attr({ type: 'hidden', name, value: $(this).prop('checked') ? 'Y' : 'N' });
          $(this).after(hiddenField);
        } else {
          hiddenField.val($(this).prop('checked') ? 'Y' : 'N');
        }
      }
    });

    $('#hidden_preservation_type').val($('.grp-long-shelf:checked').val() || '');
    $('#hidden_processing_method').val($('.grp-sterilization:checked').not('#chk_sterilization_other').val() || '');
    $('#hidden_processing_condition').val($('input[name="processing_condition"]').val() || '');
  }

  // ------------------ Select2 초기화 ------------------
  function initSelect2Components() {
    $('#food_group').select2({ placeholder: '대분류 선택', allowClear: true, width: '100%' });
    $('#food_type').select2({ placeholder: '소분류 선택', allowClear: true, width: '100%' });
    $('select[name="country_of_origin"]').select2({ placeholder: '대외무역법에 따른 가공국을 선택하세요.', allowClear: true, width: '100%' });
    $('select[name="date_option"]').select2({ placeholder: '옵션 선택', allowClear: true, width: '100%' });
  }

  // ------------------ 내문구 탭 기능 ------------------
  function getCategoryFromFieldName(fieldName) {
    const mapping = {
      storage_method: 'storage',
      frmlc_mtrqlt: 'package',
      bssh_nm: 'manufacturer',
      distributor_address: 'distributor',
      repacker_address: 'repacker',
      importer_address: 'importer',
      pog_daycnt: 'expiry',
      cautions: 'cautions',
      additional_info: 'additional'
    };
    return mapping[fieldName] || null;
  }

  function renderMyPhrasesForFocusedField() {
    const fieldName = lastFocusedFieldName || 'prdlst_nm';
    const category = getCategoryFromFieldName(fieldName);
    const listContainer = document.getElementById('myPhraseList');
    if (!listContainer || !category || !phrasesData) {
      if (listContainer) listContainer.innerHTML = '<div class="text-muted" style="font-size: 0.8rem;">문구 데이터를 로드할 수 없습니다.</div>';
      return;
    }

    listContainer.innerHTML = '<div class="loading" style="font-size: 0.8rem;">로딩 중...</div>';
    const isMultiSelect = ['cautions', 'additional'].includes(category);
    const textarea = document.querySelector(`textarea[name="${fieldName}"], input[name="${fieldName}"]`);
    const currentValues = textarea ? textarea.value.split('\n').map(v => v.trim()).filter(Boolean) : [];

    const phraseList = phrasesData[category] || [];
    if (!phraseList.length) {
      listContainer.innerHTML = '<div class="text-muted" style="font-size: 0.8rem;">저장된 문구가 없습니다. 문구 관리에서 추가하세요.</div>';
      return;
    }

    const sortedPhrases = [...phraseList].sort((a, b) => (b.note?.includes('★') ? 1 : 0) - (a.note?.includes('★') ? 1 : 0));

    setTimeout(() => {
      listContainer.innerHTML = '';
      sortedPhrases.forEach(p => {
        const div = document.createElement('div');
        div.className = 'phrase-item';
        div.textContent = p.content;
        Object.assign(div.style, {
          padding: '6px 8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          transition: 'background-color 0.2s',
          marginBottom: '4px'
        });

        div.addEventListener('click', () => {
          if (!textarea) return;
          if (isMultiSelect) {
            const values = textarea.value.split('\n').map(v => v.trim()).filter(Boolean);
            const index = values.indexOf(p.content);
            if (index === -1) {
              values.push(p.content);
              div.style.backgroundColor = '#d0ebff';
            } else {
              values.splice(index, 1);
              div.style.backgroundColor = '#fff';
            }
            textarea.value = values.join('\n');
          } else {
            // 단일 선택: 그대로 설정 후 스타일 변경
            const isSelected = textarea.value === p.content;
            textarea.value = isSelected ? '' : p.content;
            listContainer.querySelectorAll('.phrase-item').forEach(item => {
              item.style.backgroundColor = item.textContent === textarea.value ? '#d0ebff' : '#fff';
            });
          }
          updateTextareaHeight(textarea);
        });

        div.style.backgroundColor = currentValues.includes(p.content) ? '#d0ebff' : '#fff';
        if (p.note) div.title = p.note;
        listContainer.appendChild(div);
      });
    }, 300);
  }

  function showRegulationInfo(fieldName) {
    const container = document.getElementById('myPhraseContainer');
    if (!container) return;
  
    container.querySelectorAll('.text-muted, .regulation-info').forEach(el => el.remove());
  
    const fieldMapping = {
      my_label_name: 'label_nm',
      prdlst_dcnm: 'prdlst_dcnm',
      prdlst_nm: 'prdlst_nm',
      ingredient_info: 'ingredients_info',
      content_weight: 'content_weight',
      storage_method: 'storage',
      frmlc_mtrqlt: 'package',
      bssh_nm: 'manufacturer',
      distributor_address: 'distributor',
      pog_daycnt: 'expiry',
      weight_calorie: 'weight_calorie',
      rawmtrl_nm_display: 'rawmtrl_nm',
      cautions: 'cautions',
      additional_info: 'additional'
    };
  
    const regulationInfo = regulations[fieldMapping[fieldName] || fieldName];
    if (regulationInfo) {
      const infoContainer = document.createElement('div');
      infoContainer.className = 'regulation-info';
      infoContainer.innerHTML = regulationInfo
        .split('\n')
        .map(line => (line.trim() ? `<p class="mb-1">${line}</p>` : '<br>'))
        .join('');
      container.appendChild(infoContainer);
    }
  }

  // ------------------ 초기화 및 이벤트 바인딩 ------------------
  $(document).ready(function () {
    initSelect2Components();
    initCheckBoxGroups();
    initToggleButtons();
    initFoodTypeFiltering();
    initCheckboxFieldToggle();
    initAutoExpand();

    $('#labelForm').on('submit', function () {
      $('#hidden_food_group').val($('#food_group').val());
      $('#hidden_food_type').val($('#food_type').val());
      prepareFormData();
      return true;
    });

    $('.select2-food-type, input[type="checkbox"], input[name="processing_condition"]').on('change input', updateSummary);

    document.querySelectorAll('textarea, input[type="text"]').forEach(el => {
      el.addEventListener('focus', function () {
        clearTimeout(window.focusTimeout);
        window.focusTimeout = setTimeout(() => {
          lastFocusedFieldName = this.getAttribute('name');
          if (document.querySelector('#myphrases-tab.active')) {
            renderMyPhrasesForFocusedField();
            showRegulationInfo(lastFocusedFieldName);
          }
        }, 100);
      });
    });

    const myPhrasesTab = document.querySelector('#myphrases-tab');
    if (myPhrasesTab) {
      myPhrasesTab.addEventListener('shown.bs.tab', () => {
        if (lastFocusedFieldName) {
          renderMyPhrasesForFocusedField();
          showRegulationInfo(lastFocusedFieldName);
        }
      });
    }

    document.querySelectorAll('#phraseTab .nav-link').forEach(btn => {
      btn.style.fontSize = '0.8rem';
      btn.addEventListener('shown.bs.tab', () => {
        document.querySelectorAll('#phraseTab .nav-link').forEach(b => (b.style.color = ''));
        btn.style.color = '#0d6efd';
      });
      btn.style.color = btn.classList.contains('active') ? '#0d6efd' : '';
    });

    updateSummary();
  });
});