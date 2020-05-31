$(document).ready(function() {
  const $form = $('#new-map-name');

  $form.submit(function(event) {
    event.preventDefault();

    const entry = $(this).serialize();

    $.post('/api/maps/', entry)
  })
})