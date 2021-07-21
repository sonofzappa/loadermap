mapboxgl.accessToken = 'pk.eyJ1Ijoic29ub2Z6YXBwYSIsImEiOiJja3Jja3cwZXUwZjFqMndrZGwzN3Y0b29mIn0.yvnJbPzQiaKxfgrPK2T-iw';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10', 
  center: loader.geometry.coordinates,
  zoom: 8 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(loader.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25 })
      .setHTML(
          `<h3>${loader.company}</h3><p>${loader.location}</p><p>${loader.phone}</p>`
      )
)
.addTo(map);