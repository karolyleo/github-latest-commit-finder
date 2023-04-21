(async()=>{
    const events = await getGitHubEvents('karolyleo');
    findLatestCommit(events);
})()

const events = async (username) => {
    const events = await getGitHubEvents(username);
    findLatestCommit(events);
};

wait(1000).then((time) => console.log(`You'll see this after ${time / 1000} seconds`));
wait(3000).then((time) => console.log(`You'll see this after ${time / 1000} seconds`));


document.getElementById("searchButton").addEventListener("click", function() {
    events(document.getElementById("usernameSearch").value);
    console.log('search was pressed', document.getElementById("usernameSearch").value)
});
document.getElementById("usernameSearch").addEventListener("keypress", function(e) {
    if (e.which === 13) {
        events(document.getElementById("usernameSearch").value);
        console.log('enter was pressed', document.getElementById("usernameSearch").value)
    }
});

async function getGitHubEvents(username = 'karolyleo') {
    const url = `https://api.github.com/users/${username}/events/public`
    const options = {
        headers: {
            'Authorization': `token ${keys.github}`
        }
    }
    const response = await fetch(url, options)
        .then(res => res.json())
        .then(data => {
            const pushEvents = data.filter(event => event.type = 'PushEvent')
            return pushEvents
        })
    return response;
}

function findLatestCommit(events) {
    const { repo, payload, created_at } = events[0] //the latest commit is the first one in the Arr
    let result = { //custom Styling
        name: repo.name,
        message: payload.commits[0].message,
        when: created_at,
        url: repo.url
    };
    document.getElementById('latestCommit')
        .innerHTML = `
        <div class="d-flex align-items-center flex-direction-row"> <h6 class="text-danger"> Repo: </h6> <p>${repo.name}</p> </div>
        <div class="d-flex align-items-center flex-direction-row"> <h6 class="text-danger"> message: </h6> <p>${payload.commits[0].message}</p>  </div>
        <div class="d-flex align-items-center flex-direction-row"> <h6 class="text-danger"> when: </h6> <p>${created_at}</p>    </div>
        <div class="d-flex align-items-center flex-direction-row"> <h6 class="text-danger"> url: </h6> <p>${repo.url}</p>  </div>`;
    console.log(result);
}

function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(milliseconds);
        }, milliseconds);
    });
}