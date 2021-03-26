export default class QuakesView {
  renderQuakeList(quakeList, listElement) {
    quakeList.features.forEach(element => {
      const item = document.createElement('li');
      item.setAttribute('data-id', element.id);
      item.innerHTML = `${element.properties.title}
      <p>${new Date(element.properties.time)}</p>`;
      listElement.appendChild(item);
    });
  }

  renderQuake(quake, element) {
    const quakeProperties = Object.entries(quake.properties);

    element.innerHTML = quakeProperties.map(item => {
      if (item[0] === 'time' || item[0] === 'updated') {
        return `<li>${item[0]}: ${new Date(item[1])}</li>`;
      } else {
        return `<li>${item[0]}: ${item[1]}}`;
      }
    }).join('');
  }
}
