import React, {useEffect, useRef, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import './App.css';

interface TransformData {
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    time?: number;
    rotate?: string;
}

interface PageData {
    images: (TransformData & { src: string; })[];
    text: (TransformData & { text: string; size: string; })[];
}

const getSize = (() => {
    const e = document.createElement('div');
    e.style.position = "absolute";
    e.style.visibility = "hidden";
    e.style.height = "auto";
    e.style.width = "auto";
    e.style.whiteSpace = "nowrap";
    document.body.appendChild(e);

    return (text: string, fontSize: string) => {
        e.style.fontSize = fontSize;
        e.innerText = text;
        return [e.clientWidth, e.clientHeight] as const;
    };
})();

function buildTransform(t: TransformData, text="", fontSize="") {
    const style: React.CSSProperties = {};

    let halfWidth = 0;
    let halfHeight = 0;
    const centre = text && fontSize;
    if(centre) {
        [halfWidth, halfHeight] = getSize(text, fontSize);
        halfWidth /= 2;
        halfHeight /= 2;
    }

    if(fontSize) {
        style.fontSize = fontSize;
    }

    if(t.x !== undefined) {
        style.left = centre ? `calc(${t.x} - ${halfWidth}px)` : t.x;
    }

    if(t.y !== undefined) {
        style.bottom = centre ? `calc(${t.y} - ${halfHeight}px)` : t.y;
    }

    const transforms = [];

    if(t.rotate !== undefined) {
        transforms.push(`rotate(${t.rotate})`);
    }

    if(transforms.length) {
        style.transform = transforms.join(' ');
    }

    if(t.width !== undefined) {
        style.width = t.width
    }

    if(t.height !== undefined) {
        style.height = t.height;
    }

    return style;
}

function defaultValue<T>(obj: T | undefined, d: T) {
    return obj !== undefined ? obj : d;
}

function FadeIn(props: {delay: number, children?: React.ReactChild, onAppear: () => void}) {
    const {delay, onAppear, children} = props;

    const [active, setActive] = useState(false);

    useEffect(() => {
        function appear() {
            setActive(true);
            onAppear();
        }

        if(delay) {
            const timeout = setTimeout(appear, delay * 1000);
            return () => clearTimeout(timeout);
        }
        else {
            appear();
        }
    }, []);

    return (
        <CSSTransition
            in={active}
            timeout={200}
            classNames="fade-transition">
            <div className="fade-transition">
                {children}
            </div>
        </CSSTransition>
    )
}

function TextEntry(props: PageData["text"][number] & {onAppear: () => void}) {
    const style = buildTransform(props, props.text, props.size);

    const text = props.text.split('\n').reduce((p, c) => {
        p.push(c);
        p.push(<br/>);
        return p;
    }, [] as React.ReactChild[]);

    return (
        <FadeIn delay={props.time ?? 0} onAppear={props.onAppear}>
            <span className="page-text-entry" style={style}>{text}</span>
        </FadeIn>
    );
}

function ImageEntry(props: PageData["images"][number] & {onAppear: () => void}) {
    const style = buildTransform(props);

    return (
        <FadeIn delay={props.time ?? 0} onAppear={props.onAppear}>
            <img className="page-image-entry" style={style} src={props.src} alt={props.src}/>
        </FadeIn>
    )
}

const pages: PageData[] = [

    // Introduction
    {
        images: [],
        text: [
            {text: "Hi Jess!", x: "50%", y: "70%", time: 1.0, size: "10em"},
            {text: "Happy birthday! This is your present!", x: "50%", y: "55%", time: 2.0, size: "4em"},
            {text: "Click to continue", x: "50%", y: "40%", time: 3.0, size: "2em"}
        ]
    },

    {
        images: [],
        text: [
            {text: "I put together a little thing to recap our time together as a couple.", x: "50%", y: "60%", size: "2em", time: 1.0},
            {text: "I hope you like it :D", x: "50%", y: "50%", size: "2em", time: 2},
        ]
    },

    {
        images: [
            {src: "pax_1.jpg", x: "10%", y: "55%", rotate: "-20deg", width: "40%", time: 2.5},
            {src: "pax_2.jpg", x: "20%", y: "15%", rotate: "20deg", width: "25%", time: 3},
            {src: "pax2019_6.jpg", x: "40%", y: "2%", width: "20%",  time: 3.5}
        ],
        text: [
            {text: "I thought a good place to start is Pax.", x: "75%", y: "75%", size: "1.5em", time: 1.0},
            {text: "The one event we go to every year.", x: "75%", y: "70%", size: "1.5em", time: 1.5},
            {text: "It's honestly by far my favourite", x: "75%", y: "65%", size: "1.5em", time: 2},
        ]
    },

    // Pax first
    {
        images: [
            {src: "pax2014.jpg", x: "10%", y: "10%", width: "30%", time: 1.0}
        ],
        text: [
            {
                text: "I wanted to bring special attention to this picture from our first pax.\n\n" +
                    "I've seen it in passing a few times, but it's always felt a bit special for some reason.\n\n" +
                    "I suppose it was the first time we were playing games while being in the same location.\n\n" +
                    "Either way, it's from PAX 2014, our first PAX too, and the first time we met in person!\n\n" +
                    "It was at PAX the year later that I asked to be in a relationship with you.\n\n" +
                    "Sadly, I couldn't really find any good photos from that PAX.\n\n" +
                    "But oh well, I certainly remember it well",
                x: "70%",
                y: "70%",
                size: "1.5em",
                time: 1.25
            }
        ]
    },

    // Pax Past
    {
        images: [
            {src: "pax2018_1.jpg", x: "0", width: "33.3%", time: 2.0},
            {src: "pax2018_2.jpg", x: "33.3%", width: "33.4%", time: 1.5},
            {src: "pax2018_3.jpg", x: "66.7%", width: "33.3%", time: 1.0}
        ],
        text: [
            {text: "PAX 2018!", x: "50%", y: "50%", size: "5em", time: 2.5},
            {text: "This one is an especially special PAX because it was your first time meeting Mana!", x: "21.5%", y: "35%", size: "1.25em", time: 2.75},
            {text: "You've known him for so long, way longer than me, and you two have stayed friends all this time", x: "25%", y: "30%", size: "1.25em", time: 3},
            {text: "It's really nice, and Mana is a really great guy.", x: "78.25%", y: "35%", size: "1.25em", time: 3.25},
            {text: "I'm glad you've both kept up your friendship this long.", x: "80%", y: "30%", size: "1.25em", time: 3.5},
            {text: "I hope he wished you a happy birthday today!", x: "50%", y: "10%", size: "3em", time: 3.75}
        ]
    },

    // Pax 2019
    {
        images: [
            {src: "pax2019_1.jpg", x: "0", y: "0", width: "25%", time: 1.5},
            {src: "pax2019_2.jpg", x: "25%", y: "0", width: "25%", time: 2},
            {src: "pax2019_3.jpg", x: "50%", y: "0", width: "25%", time: 2.5},
            {src: "pax2019_4.jpg", x: "75%", y: "0", width: "25%", time: 4},
        ],
        text: [
            {text: "PAX 2019!", x: "12.5%", y: "90%", size: "5em", time: 0.5},
            {text: "I loved this one because it was our first time actually cosplaying.", x: "12.5%", y: "80%", size: "1em", time: 1},
            {text: "We made seriously good D-Bois", x: "87.5%", y: "85%", size: "1em", time: 3},
            {text: "and we had so many people coming and talking to us.", x: "87.5%", y: "82.5%", size: "1em", time: 3.25},
            {text: "It was such a load of fun,", x: "87.5%", y: "45%", size: "1em", time: 3.5},
            {text: "and I can't wait to do it again this year!", x: "87.5%", y: "42.5%", size: "1em", time: 3.75}
        ]
    },

    {
        images: [],
        text: [
            {text: "Okay! That's everything for PAX.", x: "50%", y: "60%", size: "5em"},
            {text: "Now for something different...", x: "50%", y: "40%", size: "5em"}
        ]
    },

    // Pokemon go
    {
        images: [
            {src: "pokemon_go1.jpg", width: "20%", time: 2.0},
            {src: "pokemon_go2.jpg", width: "20%", x: "20%", time: 3.0},
            {src: "pokemon_go3.jpg", width: "20%", x: "40%", time: 4},
            {src: "pokemon_go4.jpg", width: "20%", x: "60%", time: 3.5},
            {src: "pomeon_go2.jpg", width: "20%", x: "80%", time: 2.5},
        ],
        text: [
            {text: "POKEMON GO!", x: "20%", y: "10%", size: "5em", time: 1},
            {text: "This game has become a pretty reasonable part of our lives.", x: "70%", y: "15%", size: "1em", time: 4.5},
            {text: "We're always out catching pokemon on community days, and whenever we go out together really.", x: "70%", y: "12.5%", size: "1em", time: 4.75},
            {text: "We've also made a whole bunch of great friends through the game.", x: "70%", y: "10%", size: "1em", time: 5},
            {text: "I think it's had a really positive influence on our lives.", x: "70%", y: "7.5%", size: "1em", time: 5.25}
        ]
    },

    // Waffles 1
    {
        images: [
            {src: "waffles1.jpg", x: "5%", y: "30%", time: 1.0},
            {src: "waffles2.jpg", x: "37.5%", y: "30%", time: 1.5},
            {src: "waffles3.jpg", x: "70%", y: "10%", time: 2.0},
        ],
        text: [
            {text: "WAFFLES", x: "80%", y: "90%", size: "5em", time: 0.5},
            {text: "Dude we have so many pictures of these holy shit.", x: "35%", y: "15%", size: "3em", time: 1.0}
        ]
    },

    // Waffles 2
    {
        images: [
            {src: "waffles4.jpg", x: "10%", y: "20%", rotate: "45deg", time: 1},
            {src: "waffles5.jpg", x: "30%", y: "20%", width: "50%", rotate: "-25deg", time: 1.5},
            {src: "waffles6.jpg", x: "70%", y: "10%", time: 2},
        ],
        text: [
            {text: "W A F F L E S", x: "20%", y: "10%", size: "5em", time: 1},
            {text: "waffles waffles waffles", x: "10%", y: "30%", size: "4em", rotate: "170deg", time: 1.25},
            {text: "waffles waffles waffles", x: "80%", y: "60%", size: "5em", rotate: "250deg", time: 1.5},
            {text: "waffles waffles waffles", size: "10em", rotate: "45deg", time: 1.75},
            {text: "waffles waffles waffles", x: "40%", y: "50%", size: "2em", rotate: "-15deg", time: 2},
            {text: "waffles waffles waffles", size: "4em", time: 2.25}
        ]
    },


    // Churros
    {
        images: [
            {src: "churros1.jpg", width: "25%", x: "5%", time: 2},
            {src: "churros2.jpg", width: "20%", x: "40%", time: 3},
            {src: "churros3.jpg", width: "25%", x: "70%", time: 4},
        ],
        text: [
            {text: "CHURROS", x: "80%", y: "10%", size: "5em", time: 1},

            {text: "God damn do you remember this day?", x: "17.5%", y: "25%", size: "1em", time: 2.5},
            {text: "Going to San Churro on valentines day.", x: "17.5%", y: "20%", size: "1em", time: 2.75},

            {text: "Remember we had the raptor head with us too?", x: "50%", y: "20%", size: "1em", time: 3.5},
            {text: "He ate all of the churros :(", x: "50%", y: "15%", size: "1em", time: 3.75},

            {text: "Holy shit I look terrible in this photo though.", x: "82.5%", y: "55%", size: "1em", time: 4.5},
        ]
    },

    // Cookie
    {
        images: [
            {src: "cookie.jpg", x: "70%", rotate: "-20deg", width: "25%", time: 2.0},
            {src: "cookie2.jpg", x: "70%", y: "10%", rotate: "20deg", width: "25%", time: 1.5},
        ],
        text: [
            {text: "COOKIE DOUGH!", x: "20%", y: "10%", size: "5em", time: 1},
            {text: "We met up with Mary and ate insanely rich cookie dough", x: "45%", y: "20%", size: "2em", time: 1.5},
            {text: "Like holy shit this cookie dough was rich omfg.", x: "45%", y: "80%", size: "2em", time: 2.0}
        ]
    },

    // Cute pictures end
    {
        images: [
            {src: "cute.jpg", x: "15%", y: "40%", width: "25%", time: 2.0},
            {src: "pandas.jpg", x: "60%", y: "30%", width: "25%", time: 3.0},
        ],
        text: [
            {text: "Just some final pictures to finish off with.", x: "50%", y: "20%", size: "2em", time: 1.0},
            {text: "I thought these two were really cute :)", x: "50%", y: "15%", size: "2em", time: 1.5},

            {text: "Wow you look so adorable in my graduate cap", x: "27.5%", y: "37.5%", size: "1em", time: 2.25},
            {text: "Look at that smile :3", x: "27.5%", y: "32.5%", size: "1em", time: 2.5},

            {text: "Look at those lil pandas, so cute", x: "72.5%", y: "27.5%", size: "1em", time: 3.25}
        ]
    },

    {
        images: [],
        text: [
            {text: "Well, that's it!", x: "50%", y: "60%", size: "2em"},
            {text: "Thanks for clicking through and looking at all of this Melu!", x: "50%", y: "55%", size: "2em"},
            {text: "I hope you've liked it.", x: "50%", y: "50%", size: "2em"},
            {text: "Happy Birthday, and I love you!", x: "50%", y: "45%", size: "2em"}
        ]
    },

    {
        images: [],
        text: [
            {text: "From Sam <3", x: "50%", y: "50%", size: "10em"}
        ]
    }
];

export default function App() {

    const [page, setPage] = useState(0);
    const [active, setActive] = useState(true);
    const [transitionCount, setTransitionCount] = useState(0);

    function transitionPage() {
        const p = pages[page];
        const count = Object.keys(p.images).length + Object.keys(p.text).length;
        if(page !== pages.length - 1 && active && transitionCount === count) {
            setActive(false);
        }
    }

    function onExited() {
        setPage(page + 1);
        setActive(true);
        setTransitionCount(0);
    }

    function onImageLoaded() {
        setTransitionCount(p => p + 1);
    }

    const current = pages[page];
    const count = Object.keys(current.images).length + Object.keys(current.text).length;

    const indexBase = page * 1000;

    return (
        <div
            className={"app" + (transitionCount === count ? " app-click" : "")}
            onClick={transitionPage}>
            <CSSTransition
                timeout={200}
                classNames="fade-transition"
                in={active}
                onExited={onExited}>
                <div className="page">
                    <div className="page-background">
                        {current.images.map((img, i) =>
                            <ImageEntry key={img.src + i + indexBase} onAppear={onImageLoaded} {...img}/>
                        )}
                    </div>
                    <div className="page-text">
                        {current.text.map((t, i) =>
                            <TextEntry key={t.text + i + indexBase} onAppear={onImageLoaded} {...t}/>
                        )}
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
}