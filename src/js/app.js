window.addEventListener('load', () => {
  let latitude;
  let longitude;
  let headerInfo= document.querySelector('.header__info');
  let locationTimezone = document.querySelector('.location__timezone');
  let temperatureTitle = document.querySelector('.temperature__number');
  let temperatureDescription = document.querySelector('.temperature__description');

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/85a6b29fc7facfc25c260fc72971a56f/${latitude},${longitude}`;

      fetch(api)
        .then((responce) => {
          return responce.json();
        })
        .then((data) => {
          console.log(data);
          const { temperature, summary, icon } = data.currently;
          locationTimezone.textContent = data.timezone;
          temperatureTitle.textContent = temperature;
          temperatureDescription.textContent = summary;

          setIcons(icon, document.querySelector('.icon'));
        })
        .catch(() => {
          headerInfo.textContent = 'Sorry, an error has occurred';
        });
    });
  } else {
    headerInfo.textContent = 'Please provide location information';
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({"color": "white"});
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }

});