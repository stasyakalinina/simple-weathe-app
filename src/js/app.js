window.addEventListener('load', () => {
  let latitude;
  let longitude;
  let headerInfo= document.querySelector('.header__info');
  let locationTimezone = document.querySelector('.location__timezone');
  let temperatureBlock = document.querySelector('.temperature');
  let temperatureNumber = temperatureBlock.querySelector('.temperature__number');
  let temperatureScale = temperatureBlock.querySelector('.temperature__scale');
  let summaryDescription = document.querySelector('.summary__description');

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
          // console.log(data);
          const { temperature, summary, icon } = data.currently;

          locationTimezone.textContent = data.timezone;
          temperatureNumber.textContent = temperature;
          summaryDescription.textContent = summary;

          setIcons(icon, document.querySelector('.icon'));

          temperatureBlock.addEventListener('click', () => {
            changeScale(temperature);
          });
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

  function changeScale(temperature) {
    let celcius = Math.floor((temperature - 32) * (5 / 9));

    if (temperatureScale.textContent === 'F') {
      temperatureScale.textContent = 'C';
      temperatureNumber.textContent = celcius;
    } else {
      temperatureScale.textContent = 'F';
      temperatureNumber.textContent = temperature;
    }
  }
});