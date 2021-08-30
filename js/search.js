
export default function autocomplete(inp) {
    let currentFocus;
    inp.addEventListener('input', e => {
        let a, b, i, val = inp.value;
        closeAllLists();
        if (!val || val.length < 3) return false;
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", inp.id + "autocomplete-list")
        a.setAttribute("class", "autocomplete-items")
        a.style.width = '300px'
        a.style.position = 'absolute'
        a.style.top = '50px'
        a.style.backgroundColor = '#f1f1f1'
        inp.parentNode.appendChild(a);

        const city = fetch(`https://autocomplete.travelpayouts.com/places2?term=${val}&locale=en&types[]=city`)
        city.then(res => res.json()).then(res => {
            if (res.length < 1) {
                console.log(res.length)
                throw "No cities matched"
            }
            const dataset = res;
            console.log(res)
            for (let i = 0; i < 10; i++) {
                const city = dataset[i].name
                const {lat, lon} = dataset[i].coordinates
                if (city.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    b = document.createElement("DIV")

                    b.innerHTML = "<strong>" + city.substr(0, val.length) + "</strong>" + city.substr(val.length) + `, ${dataset[i].country_name}`
                    b.innerHTML += `<input type='hidden' value='${city}'>`;
                    b.style.color = 'black'
                    b.style.border = '1px solid #cccccc';

                    b.addEventListener("click", e => {
                        inp.value = e.path[0].getElementsByTagName("input")[0].value
                        inp.dataset.lat = lat
                        inp.dataset.lon = lon;
                        closeAllLists()
                    });
                    a.appendChild(b);
                }
            }
        }).catch(res => {
            console.log(res)
        })
    })
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(inp.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        console.log(currentFocus)
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
