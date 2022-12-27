async function httpGetAsync(url) {
    response = await fetch(url);
    if (response.status !== 200) {
      reject();
    };
    return await response.text();
}

function failId(id) {
    document.getElementById(id).innerText = browser.i18n.getMessage("popupErrorFailed")
}

// Localize the UI
//console.log("Current locale: " + browser.i18n.getUILanguage())
document.getElementById("ip_description").innerText = browser.i18n.getMessage("popupIpDescription")
document.getElementById("location_description").innerText = browser.i18n.getMessage("popupLocationDescription")
document.getElementById("ip").innerText = browser.i18n.getMessage("popupLoading")
document.getElementById("location").innerText = browser.i18n.getMessage("popupLoading")

// Localize the location, default: "en"
// to be supported in the future: ["es", "pt-BR", "fr", "ja", "zh-CN", "ru"]
/* logic: 
    if language is full supported, choose it. 
    if language is in another region supported, choose the other region.
    otherwise choose english.
    */
api_locales = ["en", "de"]  //["es", "pt-BR", "fr", "ja", "zh-CN", "ru"]
api_lang = browser.i18n.getUILanguage()
console.log("Location locale: " + api_lang)

if (api_locales.includes(api_lang)) {
    //console.log("no change")

} else if (api_locales.includes(api_lang.split("-")[0])) {
    api_lang = api_lang.split("-")[0]
    //console.log("split change")

} else if (api_locales.findIndex(element => element.startsWith(api_lang.split("-")[0])) > -1) {
    api_lang = api_locales[api_locales.findIndex(element => element.startsWith(api_lang.split("-")[0]))]
    //console.log("region change")

} else {
    api_lang = "en"
    //console.log("english change")
}

//console.log("Location locale: " + api_lang)



// find ip and corresponding location
httpGetAsync("https://api.ipify.org/")
    .then(
        // ip found successful
        (response)=>{
            document.getElementById("ip").innerText = response

            httpGetAsync("http://ip-api.com/csv/" + response + "?fields=status,message,countryCode,regionName,city&lang=" + api_lang)
                .then(
                    // location found successful
                    (response)=>{
                        detail_array = response.replace(/(\r\n|\n|\r)/gm, "").split(",")

                        if (detail_array[0] == "success") {
                            document.getElementById("location").innerText = detail_array.slice(1,4).join(" / ")

                        } else {
                            failId("location")
                        }
                    }
                )

                .catch(
                    ()=>{
                        // location not found
                        failId("location")
                    }
                )
        })

    .catch(
    ()=>{
        // ip not found
        failId("ip")
        failId("location")
    }
)