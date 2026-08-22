/*
 * Static demo behaviour.
 *
 * The original site posted every form to include/function_do.php and filtered
 * the Maps / Developers / Docs lists through the same endpoint. There is no PHP
 * in this export, so this file stands in for all of it:
 *
 *   - form submissions are validated, logged to the console, run through a
 *     mock API call and confirmed with the site's existing SweetAlert toast
 *   - the three search boxes filter the cards that are already on the page
 *   - Doc_Open and Maps_Google read their query string in the browser
 *
 * Markup, ids and validation rules are unchanged from the PHP version.
 */
(function ($) {
  'use strict';

  var EMAIL = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  /* ---------------------------------------------------------------- toast */

  function toast(icon, title, text) {
    if (window.Swal) {
      return Swal.fire({
        icon: icon,
        title: title,
        text: text || '',
        confirmButtonColor: '#f0b71c',
      });
    }
    window.alert(title + (text ? '\n\n' + text : ''));
    return Promise.resolve();
  }

  /**
   * Stands in for the AJAX round trip: same shape, same latency, no server.
   */
  function mockApi(endpoint, payload) {
    console.log('[demo] POST ' + endpoint, payload);
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ ok: true, endpoint: endpoint, received: payload });
      }, 450);
    });
  }

  function val(sel) {
    return ($(sel).val() || '').toString().trim();
  }

  function clear(fields) {
    fields.forEach(function (sel) {
      $(sel).val('');
    });
  }

  /**
   * Wire one button to the mock endpoint.
   *
   * spec.fields maps a payload key to its selector; spec.require lists the keys
   * that may not be blank; spec.email names the key validated as an address.
   */
  function wire(spec) {
    var $btn = $(spec.button);
    if (!$btn.length) return;

    $btn.on('click', function (e) {
      e.preventDefault();

      var payload = {};
      Object.keys(spec.fields).forEach(function (key) {
        payload[key] = val(spec.fields[key]);
      });

      var missing = (spec.require || []).filter(function (key) {
        return !payload[key];
      });
      if (missing.length) {
        toast('warning', 'Please complete the form', 'Required: ' + missing.join(', ') + '.');
        return;
      }
      if (spec.email && !EMAIL.test(payload[spec.email])) {
        toast('warning', 'Check the email address', 'That does not look like a valid email.');
        return;
      }

      $btn.prop('disabled', true);
      mockApi(spec.endpoint, payload).then(function (res) {
        $btn.prop('disabled', false);
        console.log('[demo] response', res);
        toast('success', spec.title, spec.message);
        var keep = spec.keep || [];
        clear(
          Object.keys(spec.fields)
            .map(function (key) {
              return spec.fields[key];
            })
            .filter(function (sel) {
              return keep.indexOf(sel) === -1;
            })
        );
      });
    });
  }

  var DEMO_NOTE = 'This is a static demo, so nothing was actually sent.';

  $(function () {
    /* ------------------------------------------------------------- forms */

    wire({
      button: '#contactButton',
      endpoint: '/api/contact',
      fields: {
        fullname: '#fullname',
        mobileno: '#mobileno',
        emailid: '#emailid',
        subject: '#subject',
        message: '#message',
      },
      require: ['fullname', 'mobileno', 'emailid'],
      email: 'emailid',
      title: 'Thank you, we have your message',
      message: 'Our team will be in touch shortly. ' + DEMO_NOTE,
    });

    wire({
      button: '#sendEnq',
      endpoint: '/api/property-enquiry',
      fields: {
        fname: '#p_name',
        mobile: '#p_phone',
        emailid: '#p_email',
        pid: '#p_pid',
        pname: '#p_pname',
        message: '#p_message',
      },
      require: ['fname', 'mobile', 'emailid'],
      email: 'emailid',
      keep: ['#p_pid', '#p_pname'],
      title: 'Enquiry sent',
      message: 'We will get back to you about this property. ' + DEMO_NOTE,
    });

    /* The sidebar quick-enquiry replaced its own panel with a confirmation
       line rather than showing a dialog — keep that. */
    $('#SubmitQueryProperty').on('click', function (e) {
      e.preventDefault();
      var payload = {
        pname: val('#qp_name'),
        pemail: val('#qp_email'),
        pphone: val('#qp_phone'),
        pmsg: val('#qp_message'),
      };
      if (!payload.pname || !payload.pphone || !EMAIL.test(payload.pemail)) {
        toast('warning', 'Please complete the form', 'Name, phone and a valid email are required.');
        return;
      }
      mockApi('/api/quick-enquiry', payload).then(function (res) {
        console.log('[demo] response', res);
        $('#quickquerymysection').html('Enquiry Sent. We will contact you soon!');
      });
    });

    wire({
      button: '#buttonForLatestUpdate',
      endpoint: '/api/subscribe',
      fields: { emailid: '#emailForLatestUpdate' },
      require: ['emailid'],
      email: 'emailid',
      title: 'Subscribed',
      message: 'You are on the list for the latest updates. ' + DEMO_NOTE,
    });

    /* "Submit your property" kept its long field-by-field validation; the
       original then redirected to the picture-upload step, so we do too. */
    $('#SubmitPropertybyUser').on('click', function (e) {
      e.preventDefault();

      var required = [
        ['#purpose', '"Property On"'],
        ['#ptype', 'Type'],
        ['#subtype', 'Sub-type'],
        ['#city', 'City'],
        ['#location', 'Location'],
        ['#pname', 'Property Title'],
        ['#psize', 'Dimension'],
        ['#unit', 'Dimension Unit'],
        ['#did', 'Developer'],
        ['#price', 'Price'],
        ['#unit1', 'Price Unit'],
        ['#movein', 'Possession'],
        ['#details', 'Description'],
        ['#contact_person', 'Contact Person'],
        ['#contact_no', 'Contact No.'],
      ];
      for (var i = 0; i < required.length; i++) {
        if (!val(required[i][0])) {
          toast('warning', required[i][1] + ' cannot be empty', '');
          return;
        }
      }
      if (isNaN(val('#psize'))) return toast('warning', 'Only numbers allowed in size', '');
      if (isNaN(val('#price'))) return toast('warning', 'Only numbers allowed in price', '');

      var amenities = $('.ameVal:checked')
        .map(function () {
          return $(this).attr('name');
        })
        .get()
        .join(',');
      if (!amenities) return toast('warning', 'Amenities cannot be empty', '');

      var payload = { amenities: amenities };
      required.forEach(function (row) {
        payload[row[0].slice(1)] = val(row[0]);
      });
      payload.sublocation = val('#sublocation');

      mockApi('/api/submit-property', payload).then(function (res) {
        console.log('[demo] response', res);
        toast('success', 'Property submitted', 'Next: add some photographs. ' + DEMO_NOTE).then(
          function () {
            window.location.href = 'SubmitProperty2.html';
          }
        );
      });
    });

    $('#SubmitPicturebyUser').on('click', function (e) {
      e.preventDefault();
      var input = $('#fuDocument').get(0);
      var files = input && input.files ? input.files : [];
      mockApi('/api/upload-images', { count: files.length }).then(function (res) {
        console.log('[demo] response', res);
        toast(
          'success',
          'Property received and under review',
          'We will let you know once it is live. ' + DEMO_NOTE
        ).then(function () {
          window.location.href = 'index.html';
        });
      });
    });

    /* Anything left over — a stray form, or a submit button the ids above do
       not cover — must not navigate away to a .php URL. */
    $('form').on('submit', function (e) {
      e.preventDefault();
      var data = {};
      $(this)
        .serializeArray()
        .forEach(function (f) {
          data[f.name] = f.value;
        });
      console.log('[demo] POST (unmapped form)', data);
      toast('success', 'Thank you', 'We have your details. ' + DEMO_NOTE);
    });

    /* ------------------------------------------------- client-side search */

    /**
     * The PHP endpoint re-queried the database; here the full list is already
     * rendered, so filtering the cards in place gives the same result.
     */
    function filterCards(containerSel, term) {
      var q = (term || '').toString().trim().toLowerCase();
      var $cards = $(containerSel).children();
      var shown = 0;

      $cards.each(function () {
        var hit = !q || $(this).text().toLowerCase().indexOf(q) > -1;
        $(this).toggle(hit);
        if (hit) shown++;
      });

      var $empty = $(containerSel).find('.demo-no-results');
      if (!$empty.length) {
        $empty = $(
          '<div class="col-xs-12 text-center demo-no-results" style="padding:40px 0"><p>No matches found.</p></div>'
        ).appendTo(containerSel);
      }
      $empty.toggle(shown === 0);
    }

    $('#btnMaps').on('click', function (e) {
      e.preventDefault();
      filterCards('#mapSectionList', $('#selectMaps').val());
    });
    $('#selectMaps').on('input change', function () {
      filterCards('#mapSectionList', $(this).val());
    });

    $('#myDevList').on('input keyup', function () {
      filterCards('#devsSection', $(this).val());
    });

    $('#myDocList').on('input keyup', function () {
      filterCards('#docsSection', $(this).val());
    });

    /* --------------------------------------------------- query-driven pages */

    var params = new URLSearchParams(window.location.search);

    /* Doc_Open.html?dpath=…&dname=… — one page, any document. */
    if (document.body.getAttribute('data-demo-page') === 'Doc_Open') {
      var dpath = params.get('dpath') || 'documents/AGREEMENTTOSELL.doc';
      var dname = params.get('dname') || 'Document';
      var href = 'admin/assets/' + dpath;

      $('#docTitle').text(dname);
      document.title = dname + ' | Deep Real Estate';
      $('#downloadThisDoc').attr('href', href).attr('download', '');

      /* The Google viewer needs an absolute, publicly reachable URL, and the
         deploy host is not known until runtime — so build it here. */
      var abs = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + href;
      $('#docViewer').attr(
        'src',
        'https://docs.google.com/viewer?url=' + encodeURIComponent(abs) + '&embedded=true'
      );
    }

    /* Maps_Google.html?mapaddress=… */
    if (document.body.getAttribute('data-demo-page') === 'Maps_Google') {
      var addr = params.get('mapaddress') || 'Gurgaon, India';
      $('#mapHeading').text(addr);
      document.title = addr + ' | Deep Real Estate';
      $('#reloadMap').attr(
        'src',
        'https://www.google.com/maps?q=' + encodeURIComponent(addr) + '&output=embed'
      );
    }

    /* The zoom selector rewrote a query param on the old map endpoint. */
    $('#zlvl').on('change', function () {
      var $map = $('#reloadMap');
      var src = ($map.attr('src') || '').replace(/&z=\d+/, '');
      $map.attr('src', src + '&z=' + $(this).val());
    });
  });
})(window.jQuery);
