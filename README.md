# Tank-U

## What is the project about?

For my first capstone project at **Nashville Software School**, I decided to make a tower-defense game using Phaser, an HTML5 game framework.  Using your resources carefully, you must defend from the incoming onslaught of tanks with their eyes set on destroying your home city. For each enemy you defeat, you gain resources to strengthen you forces and hopefully save everyone from the brink of destruction.  The complexity in building the game is the dynacism of the turrets. They are set to rotate and fire at enemy tanks only when they are within a certain range.

## What technologies does the project use?

NPM, Bower, Grunt, HTML5, CSS3, and Phaser.

## Download and install:

*If you don't have NPM yet, from terminal:*

`curl https://npmjs.org/install.sh | sh`

In your browser, navigate to [the repo] (https://github.com/ldmcdaniel/tank-u).

In the top-right corner of the page, click Fork.

In your designated code directory, type:

```sh
git clone https://github.com/Your-Username/tank-u
cd tank-u/
npm install
bower install
grunt build-dev
grunt serve
```

To push to gh-pages, type:
`git push origin `git subtree split --prefix public master`:gh-pages --force`

Open with your favorite text editor and you should be ready to start coding.

##Changes I would like to make in future versions of the game include:

- [ ] A bit of grass covering the title screen title and exploding to reveal the title.
- [x] More than 1 wave of tanks.
- [ ] A button that appears between waves to trigger the release of the next wave of tanks.
- [x] Tanks with varying degrees of health and boss tanks.
- [x] Working tokens to purchase and upgrade turrets with different options.
- [ ] Upgrades to turrets with greater range, increased damage, varying bullet speeds and sound effects.
- [ ] Convert all .wav files to .mp3.
- [ ] Clean files and lint code to make it more efficient.
- [x] An endgame state.
