const locationIQToken = 'pk.a06f4d8a905af24115edd3a26163f682';
  const map = L.map('map').setView([28.612254, 77.216721], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // mode = pickup or drop
  let selecting = "pickup";

  const centerMarker = L.marker(map.getCenter(), {
  icon: L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  })
}).addTo(map);

map.on("move", () => {
  centerMarker.setLatLng(map.getCenter());
});

  // when map stops moving, update pickup/drop fields
  map.on("moveend", () => {
    const center = map.getCenter();
    const lat = center.lat;
    const lng = center.lng;

    if (selecting === "pickup") {
      document.getElementById("pickupLat").value = lat;
      document.getElementById("pickupLng").value = lng;
      reverseGeocode(lat, lng, (city) => {
        document.getElementById("pickupCity").value = city;
        document.getElementById("pickup").value = city; // show in input
      });
    } else if (selecting === "drop") {
      document.getElementById("dropLat").value = lat;
      document.getElementById("dropLng").value = lng;
      reverseGeocode(lat, lng, (city) => {
        document.getElementById("dropCity").value = city;
        document.getElementById("drop").value = city; // show in input
      });
    }
  });

  function reverseGeocode(lat, lng, callback) {
    fetch(`https://us1.locationiq.com/v1/reverse?key=${locationIQToken}&lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const address = data?.display_name || "Unknown";
        callback(address);
      })
      .catch(err => {
        console.error("Reverse geocoding failed:", err);
        callback("Unknown");
      });
  }

  // switch selecting mode when moving between steps
  window.setPickupMode = function () {
    selecting = "pickup";
  }
  window.setDropMode = function () {
    selecting = "drop";
  }


  function showMap() {
  const mapDiv = document.getElementById("map");
  mapDiv.style.display = "block";
  setTimeout(() => {
    map.invalidateSize(); // important to redraw properly
  }, 200);
}