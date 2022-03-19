; (function () {
    let list = []
    if (window.localStorage.__blocked__){
        list = list.concat(JSON.parse(window.localStorage.__blocked__))
    }
    let loop = () => setTimeout(() => {
        list = list.concat([...document.querySelectorAll('a.relative.overflow-hidden.dib.link')]
            .map(
                r => (
                    {
                        link: r.href,
                        username: r.title
                    }
                )
            )
        )
        console.log('length: ' + list.length)
        // save results in local storage
        window.localStorage.setItem('__blocked__', JSON.stringify(list))
        // programmatically click the "more" button
        // to fetch more companies 
        document.querySelector('.next_page').click()
        // run again in 0 - 3 seconds
        //loop()
    }, 3000 * Math.random())
    loop()
})();