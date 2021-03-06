function autocomplete(input, latInput, lngInput) {
  // console.log(input, latInput, lngInput);
  if(!input) return // skip this function from runing with no input on the page
  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
    console.log(place);
  });
   // if someone hits enter, don't submit form..on = addeventlistener
   input.on('keydown', (e) => {
     if(e.keycode === 13) e.preventDefault();
   })
}

export default autocomplete;