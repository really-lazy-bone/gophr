(function() {
  'use strict';
  angular.module('relativeDate', []).value('now', null).value('relativeDateTranslations', {
    just_now: 'now',
    seconds_ago: '{{time}} secs late',
    a_minute_ago: 'a min late',
    minutes_ago: '{{time}} mins late',
    an_hour_ago: 'an hour late',
    hours_ago: '{{time}} hours late',
    a_day_ago: 'yesterday',
    days_ago: '{{time}} days late',
    a_week_ago: 'a week late',
    weeks_ago: '{{time}} weeks late',
    a_month_ago: 'a month late',
    months_ago: '{{time}} months late',
    a_year_ago: 'a year late',
    years_ago: '{{time}} years late',
    over_a_year_ago: 'over a year late',
    seconds_from_now: '{{time}} secs remaining',
    a_minute_from_now: 'a min remaining',
    minutes_from_now: '{{time}} mins remaining',
    an_hour_from_now: 'an hour remaining',
    hours_from_now: '{{time}} hours remaining',
    a_day_from_now: 'tomorrow',
    days_from_now: '{{time}} days remaining',
    a_week_from_now: 'a week remaining',
    weeks_from_now: '{{time}} weeks remaining',
    a_month_from_now: 'a month remaining',
    months_from_now: '{{time}} months remaining',
    a_year_from_now: 'a year remaining',
    years_from_now: '{{time}} years remaining',
    over_a_year_from_now: 'over a year remaining'
  }).filter('relativeDate', [
    '$injector', 'now', 'relativeDateTranslations', function($injector, _now, relativeDateTranslations) {
      var $translate, calculateDelta;
      if ($injector.has('$translate')) {
        $translate = $injector.get('$translate');
      } else {
        $translate = {
          instant: function(id, params) {
            return relativeDateTranslations[id].replace('{{time}}', params.time);
          }
        };
      }
      calculateDelta = function(now, date) {
        return Math.round(Math.abs(now - date) / 1000);
      };
      return function(date) {
        var day, delta, hour, minute, month, now, translate, week, year;
        now = _now ? _now : new Date();
        if (!(date instanceof Date)) {
          date = new Date(date);
        }
        delta = null;
        minute = 60;
        hour = minute * 60;
        day = hour * 24;
        week = day * 7;
        month = day * 30;
        year = day * 365;
        delta = calculateDelta(now, date);
        if (delta > day && delta < week) {
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
          delta = calculateDelta(now, date);
        }
        translate = function(translatePhrase, timeValue) {
          var translateKey;
          if (translatePhrase === 'just_now') {
            translateKey = translatePhrase;
          } else if (now >= date) {
            translateKey = "" + translatePhrase + "_ago";
          } else {
            translateKey = "" + translatePhrase + "_from_now";
          }
          return $translate.instant(translateKey, {
            time: timeValue
          });
        };
        switch (false) {
          case !(delta < 30):
            return translate('just_now');
          case !(delta < minute):
            return translate('seconds', delta);
          case !(delta < 2 * minute):
            return translate('a_minute');
          case !(delta < hour):
            return translate('minutes', Math.floor(delta / minute));
          case Math.floor(delta / hour) !== 1:
            return translate('an_hour');
          case !(delta < day):
            return translate('hours', Math.floor(delta / hour));
          case !(delta < day * 2):
            return translate('a_day');
          case !(delta < week):
            return translate('days', Math.floor(delta / day));
          case Math.floor(delta / week) !== 1:
            return translate('a_week');
          case !(delta < month):
            return translate('weeks', Math.floor(delta / week));
          case Math.floor(delta / month) !== 1:
            return translate('a_month');
          case !(delta < year):
            return translate('months', Math.floor(delta / month));
          case Math.floor(delta / year) !== 1:
            return translate('a_year');
          default:
            return translate('over_a_year');
        }
      };
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=angular-relative-date.js.map
*/
