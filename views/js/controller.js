/**
 * Copyright (C) 2018-2019 thirty bees
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@thirtybees.com so we can send you a copy immediately.
 *
 * @author    thirty bees <modules@thirtybees.com>
 * @copyright 2018-2019 thirty bees
 * @license   Academic Free License (AFL 3.0)
 */

/*
 * Upgrade panel.
 */
var coreUpdaterParameters;

$(document).ready(function () {
  coreUpdaterParameters = JSON.parse($('input[name=CORE_UPDATER_PARAMETERS]').val());

  channelChange();
  $('#CORE_UPDATER_CHANNEL').on('change', channelChange);

  $('#CORE_UPDATER_VERSION').on('change', versionChange);

  addBootstrapCollapser('CORE_UPDATER_PROCESSING', false);

  if (document.getElementById('configuration_fieldset_comparepanel')) {
    processCompare();
  }
});

function channelChange() {
  let channel = $('#CORE_UPDATER_CHANNEL option:selected').val();
  let versionSelect = $('#CORE_UPDATER_VERSION');

  if ( ! channel || ! versionSelect.length) {
    return;
  }

  versionSelect.empty();
  $.ajax({
    url: coreUpdaterParameters.apiUrl,
    type: 'POST',
    data: {'list': channel},
    dataType: 'json',
    success: function(data, status, xhr) {
      data.forEach(function(version) {
          versionSelect.append('<option>'+version+'</option>');
          if (version === coreUpdaterParameters.selectedVersion) {
            versionSelect.val(coreUpdaterParameters.selectedVersion);
          }
      });
      $('#conf_id_CORE_UPDATER_VERSION')
        .find('.help-block')
        .parent()
        .slideUp(200);
    },
    error: function(xhr, status, error) {
      let helpText = $('#conf_id_CORE_UPDATER_VERSION').find('.help-block');
      helpText.html(coreUpdaterParameters.errorRetrieval);
      helpText.css('color', 'red');
      console.log('Request to '+coreUpdaterParameters.apiUrl
                  +' failed with status \''+xhr.state()+'\'.');
    },
  });
}

function versionChange() {
  if ($(this).val() === coreUpdaterParameters.selectedVersion) {
    $('#configuration_fieldset_comparepanel').slideDown(1000);
  } else {
    $('#configuration_fieldset_comparepanel').slideUp(1000);
  }
}

function processCompare() {
  let url = document.URL+'&action=processCompare&ajax=1';

  $.ajax({
    url: url,
    type: 'POST',
    data: {'compareVersion': coreUpdaterParameters.selectedVersion},
    dataType: 'json',
    success: function(data, status, xhr) {
      logField = $('textarea[name=CORE_UPDATER_PROCESSING]')[0];
      infoList = data['informations'];
      infoListLength = infoList.length;

      for (i = 0; i < infoListLength; i++) {
        logField.value += "\n";
        if (data['error'] && i === infoListLength - 1) {
          logField.value += "ERROR: ";
          $('#conf_id_CORE_UPDATER_PROCESSING')
            .find('label')
            .css('color', 'red')
            .find('*')
            .contents()
            .filter(function() {
              return this.nodeType === 3 && this.nodeValue.trim !== '';
            })
            [0].data = ' '+coreUpdaterParameters.errorProcessing;
        }
        logField.value += data['informations'][i];
      }

      logField.scrollTop = logField.scrollHeight;

      if (data['changeset']) {
        changesets = data['changeset'];
        if (changesets['change']) {
          appendChangeset(changesets['change'], 'CORE_UPDATER_UPDATE');
          addBootstrapCollapser('CORE_UPDATER_UPDATE', true);
        }
        if (changesets['add']) {
          appendChangeset(changesets['add'], 'CORE_UPDATER_ADD');
          addBootstrapCollapser('CORE_UPDATER_ADD', true);
        }
        if (changesets['remove']) {
          appendChangeset(changesets['remove'], 'CORE_UPDATER_REMOVE');
          addBootstrapCollapser('CORE_UPDATER_REMOVE', true);
        }
        if (changesets['obsolete']) {
          appendChangeset(changesets['obsolete'], 'CORE_UPDATER_REMOVE_OBSOLETE');
          addBootstrapCollapser('CORE_UPDATER_REMOVE_OBSOLETE', true);
        }
      }

      if (data['done'] === false) {
        processCompare();
      } else if ( ! data['error']) {
        $('#collapsible_CORE_UPDATER_PROCESSING').collapse('hide');
        addCompletedText('CORE_UPDATER_PROCESSING',
                         coreUpdaterParameters.completedLog);
      }
    },
    error: function(xhr, status, error) {
      $('#configuration_fieldset_comparepanel')
        .children('.form-wrapper')
        .html(coreUpdaterParameters.errorRetrieval)
        .css('color', 'red');
      console.log('Request to '+url+' failed with status \''+xhr.state()+'\'.');
    }
  });
}

function appendChangeset(changeset, field) {
  let node = $('#conf_id_'+field);

  let html = '<table class="table"><tbody>';

  let empty = true;
  for (line in changeset) {
    empty = false;
    html += '<tr>'
    if (field !== 'CORE_UPDATER_REMOVE_OBSOLETE') {
      if (changeset[line]) {
        html += '<td>M</td>';
      } else {
        html += '<td>&nbsp;</td>';
      }
    } else {
      html += '<td><input type="checkbox"></td>'
    }
    html += '<td>'+line+'</td>';
    html += '</tr>'
  }
  if (empty) {
    html += '<tr><td>-- none --</td></tr>';
  }

  html += '</tbody></table>';

  node.append(html);
}

function addCompletedText(field, text) {
  let element = $('#conf_id_'+field).children('label');
  if (element.children('a').length) {
    element = element.children('a');
  }

  let string = element[0].innerHTML.trim();
  let colon = string.slice(-1);
  if (colon === ':') {
    string = string.slice(0, -1);
  }
  string += ' ('+text+')';
  if (colon === ':') {
    string += ':';
  }

  element[0].innerHTML = string;
}

function addBootstrapCollapser(field, initiallyCollapsed) {
  let trigger = $('#conf_id_'+field).children('label');
  if ( ! trigger.length) {
    return;
  }

  let collapsible = $('#conf_id_'+field).children(':last');
  let collapsibleName = 'collapsible_'+field;

  let iconClass = 'icon-collapse-alt';
  if (initiallyCollapsed) {
    iconClass = 'icon-expand-alt';
  }
  trigger.html('<a data-toggle="collapse"'
               +'  data-target="#'+collapsibleName+'"'
               +'  style="color: inherit; text-decoration: inherit;">'
               +'<i class="'+iconClass+'"></i>'
               +' '
               +trigger.html().trim()
               +'</a>'
  );

  collapsible.attr('id', collapsibleName)
             .addClass('collapse');
  if ( ! initiallyCollapsed) {
    collapsible.addClass('in');
  }

  collapsible.on("hide.bs.collapse", function(){
    $(this).siblings('label').find('i').attr('class', 'icon-expand-alt');
  });
  collapsible.on("show.bs.collapse", function(){
    $(this).siblings('label').find('i').attr('class', 'icon-collapse-alt');
  });
}
