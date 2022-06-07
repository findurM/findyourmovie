import { getAuth } from "firebase/auth";
import ReviewCards from "../components/ReviewCards";
import { IMAGE_URL } from "../config/config";

const MyReviews = () => {
  // 임시로 넣어놓은 것. 감상평 데이터 추가되면 변경.
  const Movies = [
    {
      "adult": false,
      "backdrop_path": "/7ucaMpXAmlIM24qZZ8uI9hCY0hm.jpg",
      "genre_ids": [
        14,
        12,
        28
      ],
      "id": 338953,
      "original_language": "en",
      "original_title": "Fantastic Beasts: The Secrets of Dumbledore",
      "overview": "Professor Albus Dumbledore knows the powerful, dark wizard Gellert Grindelwald is moving to seize control of the wizarding world. Unable to stop him alone, he entrusts magizoologist Newt Scamander to lead an intrepid team of wizards and witches. They soon encounter an array of old and new beasts as they clash with Grindelwald's growing legion of followers.",
      "popularity": 7108.77,
      "poster_path": "/jrgifaYeUtTnaH7NF5Drkgjg2MB.jpg",
      "release_date": "2022-04-06",
      "title": "Fantastic Beasts: The Secrets of Dumbledore",
      "video": false,
      "vote_average": 6.8,
      "vote_count": 1536
    },
    {
      "adult": false,
      "backdrop_path": "/1Ds7xy7ILo8u2WWxdnkJth1jQVT.jpg",
      "genre_ids": [
        28,
        12,
        35
      ],
      "id": 752623,
      "original_language": "en",
      "original_title": "The Lost City",
      "overview": "A reclusive romance novelist was sure nothing could be worse than getting stuck on a book tour with her cover model until a kidnapping attempt sweeps them both into a cutthroat jungle adventure, proving life can be so much stranger, and more romantic, than any of her paperback fictions.",
      "popularity": 4459.309,
      "poster_path": "/neMZH82Stu91d3iqvLdNQfqPPyl.jpg",
      "release_date": "2022-03-24",
      "title": "The Lost City",
      "video": false,
      "vote_average": 6.7,
      "vote_count": 1028
    },
    {
      "adult": false,
      "backdrop_path": "/gG9fTyDL03fiKnOpf2tr01sncnt.jpg",
      "genre_ids": [
        28,
        878,
        14
      ],
      "id": 526896,
      "original_language": "en",
      "original_title": "Morbius",
      "overview": "Dangerously ill with a rare blood disorder, and determined to save others suffering his same fate, Dr. Michael Morbius attempts a desperate gamble. What at first appears to be a radical success soon reveals itself to be a remedy potentially worse than the disease.",
      "popularity": 4353.739,
      "poster_path": "/6JjfSchsU6daXk2AKX8EEBjO3Fm.jpg",
      "release_date": "2022-03-30",
      "title": "Morbius",
      "video": false,
      "vote_average": 6.4,
      "vote_count": 1488
    },
    {
      "adult": false,
      "backdrop_path": "/egoyMDLqCxzjnSrWOz50uLlJWmD.jpg",
      "genre_ids": [
        28,
        12,
        10751,
        35
      ],
      "id": 675353,
      "original_language": "en",
      "original_title": "Sonic the Hedgehog 2",
      "overview": "After settling in Green Hills, Sonic is eager to prove he has what it takes to be a true hero. His test comes when Dr. Robotnik returns, this time with a new partner, Knuckles, in search for an emerald that has the power to destroy civilizations. Sonic teams up with his own sidekick, Tails, and together they embark on a globe-trotting journey to find the emerald before it falls into the wrong hands.",
      "popularity": 4123.901,
      "poster_path": "/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg",
      "release_date": "2022-03-30",
      "title": "Sonic the Hedgehog 2",
      "video": false,
      "vote_average": 7.8,
      "vote_count": 1913
    },
    {
      "adult": false,
      "backdrop_path": "/kiH3KPWi7BaRMvdAigcwrUFViHl.jpg",
      "genre_ids": [
        28,
        53,
        80
      ],
      "id": 818397,
      "original_language": "en",
      "original_title": "Memory",
      "overview": "Alex, an assassin-for-hire, finds that he's become a target after he refuses to complete a job for a dangerous criminal organization. With the crime syndicate and FBI in hot pursuit, Alex has the skills to stay ahead, except for one thing: he is struggling with severe memory loss, affecting his every move. Alex must question his every action and whom he can ultimately trust.",
      "popularity": 3609.753,
      "poster_path": "/QaNLpq3Wuu2yp5ESsXYcQCOpUk.jpg",
      "release_date": "2022-04-28",
      "title": "Memory",
      "video": false,
      "vote_average": 7.2,
      "vote_count": 227
    },
    {
      "adult": false,
      "backdrop_path": "/cqnVuxXe6vA7wfNWubak3x36DKJ.jpg",
      "genre_ids": [
        28,
        12,
        14
      ],
      "id": 639933,
      "original_language": "en",
      "original_title": "The Northman",
      "overview": "Prince Amleth is on the verge of becoming a man when his father is brutally murdered by his uncle, who kidnaps the boy's mother. Two decades later, Amleth is now a Viking who's on a mission to save his mother, kill his uncle and avenge his father.",
      "popularity": 3100.419,
      "poster_path": "/zhLKlUaF1SEpO58ppHIAyENkwgw.jpg",
      "release_date": "2022-04-07",
      "title": "The Northman",
      "video": false,
      "vote_average": 7.3,
      "vote_count": 1386
    },
    {
      "adult": false,
      "backdrop_path": "/aEGiJJP91HsKVTEPy1HhmN0wRLm.jpg",
      "genre_ids": [
        28,
        12
      ],
      "id": 335787,
      "original_language": "en",
      "original_title": "Uncharted",
      "overview": "A young street-smart, Nathan Drake and his wisecracking partner Victor “Sully” Sullivan embark on a dangerous pursuit of “the greatest treasure never found” while also tracking clues that may lead to Nathan’s long-lost brother.",
      "popularity": 2591.958,
      "poster_path": "/tlZpSxYuBRoVJBOpUrPdQe9FmFq.jpg",
      "release_date": "2022-02-10",
      "title": "Uncharted",
      "video": false,
      "vote_average": 7.2,
      "vote_count": 2306
    },
    {
      "adult": false,
      "backdrop_path": "/gUNRlH66yNDH3NQblYMIwgZXJ2u.jpg",
      "genre_ids": [
        14,
        28,
        12
      ],
      "id": 453395,
      "original_language": "en",
      "original_title": "Doctor Strange in the Multiverse of Madness",
      "overview": "Doctor Strange, with the help of mystical allies both old and new, traverses the mind-bending and dangerous alternate realities of the Multiverse to confront a mysterious new adversary.",
      "popularity": 2569.962,
      "poster_path": "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
      "release_date": "2022-05-04",
      "title": "Doctor Strange in the Multiverse of Madness",
      "video": false,
      "vote_average": 7.4,
      "vote_count": 2159
    },
    {
      "adult": false,
      "backdrop_path": "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
      "genre_ids": [
        28,
        12,
        878
      ],
      "id": 634649,
      "original_language": "en",
      "original_title": "Spider-Man: No Way Home",
      "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
      "popularity": 2485.751,
      "poster_path": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      "release_date": "2021-12-15",
      "title": "Spider-Man: No Way Home",
      "video": false,
      "vote_average": 8.1,
      "vote_count": 13332
    },
    {
      "adult": false,
      "backdrop_path": "/xHrp2pq73oi9D64xigPjWW1wcz1.jpg",
      "genre_ids": [
        80,
        9648,
        53
      ],
      "id": 414906,
      "original_language": "en",
      "original_title": "The Batman",
      "overview": "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      "popularity": 2485.665,
      "poster_path": "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      "release_date": "2022-03-01",
      "title": "The Batman",
      "video": false,
      "vote_average": 7.8,
      "vote_count": 5025
    },
    {
      "adult": false,
      "backdrop_path": "/flTnaBaW1UnQtzGEIoHR7C3OYfy.jpg",
      "genre_ids": [
        878,
        28,
        12,
        53
      ],
      "id": 507086,
      "original_language": "en",
      "original_title": "Jurassic World Dominion",
      "overview": "Four years after Isla Nublar was destroyed, dinosaurs now live—and hunt—alongside humans all over the world. This fragile balance will reshape the future and determine, once and for all, whether human beings are to remain the apex predators on a planet they now share with history’s most fearsome creatures.",
      "popularity": 3074.458,
      "poster_path": "/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg",
      "release_date": "2022-06-01",
      "title": "Jurassic World Dominion",
      "video": false,
      "vote_average": 6.8,
      "vote_count": 149
    },
    {
      "adult": false,
      "backdrop_path": "/hcNM0HjfPonIzOVy6LVTDBXSfMq.jpg",
      "genre_ids": [
        28,
        53,
        80
      ],
      "id": 864116,
      "original_language": "en",
      "original_title": "A Day to Die",
      "overview": "A disgraced parole officer is indebted to a local gang leader and forced to pull off a series of dangerous drug heists within twelve hours in order to pay the $2 million dollars he owes, rescue his kidnapped pregnant wife, and settle a score with the city's corrupt police chief, who is working with the gang leader and double-crossed him years ago.",
      "popularity": 1791.272,
      "poster_path": "/8Kce1utfytAG5m1PbtVoDzmDZJH.jpg",
      "release_date": "2022-03-04",
      "title": "A Day to Die",
      "video": false,
      "vote_average": 6.1,
      "vote_count": 47
    },
    {
      "adult": false,
      "backdrop_path": "/figlwUsXXFehX3IebdjqNLV6vWk.jpg",
      "genre_ids": [
        28,
        53
      ],
      "id": 628900,
      "original_language": "en",
      "original_title": "The Contractor",
      "overview": "After being involuntarily discharged from the U.S. Special Forces, James Harper decides to support his family by joining a private contracting organization alongside his best friend and under the command of a fellow veteran. Overseas on a covert mission, Harper must evade those trying to kill him while making his way back home.",
      "popularity": 1785.719,
      "poster_path": "/rJPGPZ5soaG27MK90oKpioSiJE2.jpg",
      "release_date": "2022-03-10",
      "title": "The Contractor",
      "video": false,
      "vote_average": 6.6,
      "vote_count": 289
    },
    {
      "adult": false,
      "backdrop_path": "/fEe5fe82qHzjO4yej0o79etqsWV.jpg",
      "genre_ids": [
        16,
        35,
        10751,
        80
      ],
      "id": 629542,
      "original_language": "en",
      "original_title": "The Bad Guys",
      "overview": "When the infamous Bad Guys are finally caught after years of countless heists and being the world’s most-wanted villains, Mr. Wolf brokers a deal to save them all from prison.",
      "popularity": 1512.288,
      "poster_path": "/7qop80YfuO0BwJa1uXk1DXUUEwv.jpg",
      "release_date": "2022-03-17",
      "title": "The Bad Guys",
      "video": false,
      "vote_average": 7.8,
      "vote_count": 587
    },
    {
      "adult": false,
      "backdrop_path": "/qK7Ssnrfvrt65F66A1thvehfQg2.jpg",
      "genre_ids": [
        16,
        10751,
        35,
        12,
        9648
      ],
      "id": 420821,
      "original_language": "en",
      "original_title": "Chip 'n Dale: Rescue Rangers",
      "overview": "Decades after their successful television series was canceled, Chip and Dale must repair their broken friendship and take on their Rescue Rangers detective personas once again when a former cast mate mysteriously disappears.",
      "popularity": 1380.088,
      "poster_path": "/7UGmn8TyWPPzkjhLUW58cOUHjPS.jpg",
      "release_date": "2022-05-18",
      "title": "Chip 'n Dale: Rescue Rangers",
      "video": false,
      "vote_average": 7.1,
      "vote_count": 459
    },
    {
      "adult": false,
      "backdrop_path": "/fOy2Jurz9k6RnJnMUMRDAgBwru2.jpg",
      "genre_ids": [
        16,
        10751,
        35,
        14
      ],
      "id": 508947,
      "original_language": "en",
      "original_title": "Turning Red",
      "overview": "Thirteen-year-old Mei is experiencing the awkwardness of being a teenager with a twist – when she gets too excited, she transforms into a giant red panda.",
      "popularity": 1938.687,
      "poster_path": "/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg",
      "release_date": "2022-03-10",
      "title": "Turning Red",
      "video": false,
      "vote_average": 7.5,
      "vote_count": 2382
    },
    {
      "adult": false,
      "backdrop_path": "/wtbRUVxQVvU6QIJH1oGLDThJLib.jpg",
      "genre_ids": [
        35,
        28
      ],
      "id": 785985,
      "original_language": "fr",
      "original_title": "Loin du périph",
      "overview": "Ousmane Diakité and François Monge are two cops with very different styles, backgrounds and careers. The unlikely pair are reunited once again for a new investigation that takes them across France. What seemed to be a simple drug deal turns out to be a much bigger criminal case wrapped in danger and unexpected comedy.",
      "popularity": 1313,
      "poster_path": "/h5hVeCfYSb8gIO0F41gqidtb0AI.jpg",
      "release_date": "2022-05-06",
      "title": "The Takedown",
      "video": false,
      "vote_average": 6,
      "vote_count": 211
    },
    {
      "adult": false,
      "backdrop_path": "/9Ngw106BLlNJ4iVpRHlrDfaLpCV.jpg",
      "genre_ids": [
        878,
        12,
        28
      ],
      "id": 406759,
      "original_language": "en",
      "original_title": "Moonfall",
      "overview": "A mysterious force knocks the moon from its orbit around Earth and sends it hurtling on a collision course with life as we know it.",
      "popularity": 1351.382,
      "poster_path": "/odVv1sqVs0KxBXiA8bhIBlPgalx.jpg",
      "release_date": "2022-02-03",
      "title": "Moonfall",
      "video": false,
      "vote_average": 6.5,
      "vote_count": 1183
    },
    {
      "adult": false,
      "backdrop_path": "/i0zbSmiyyylh7H3Qb4jgscz46Pm.jpg",
      "genre_ids": [
        27
      ],
      "id": 893370,
      "original_language": "es",
      "original_title": "Virus-32",
      "overview": "A virus is unleashed and a chilling massacre runs through the streets of Montevideo.",
      "popularity": 1235.744,
      "poster_path": "/wZiF79hbhLK1U2Pj9bF67NAKXQR.jpg",
      "release_date": "2022-04-21",
      "title": "Virus:32",
      "video": false,
      "vote_average": 7.2,
      "vote_count": 74
    },
    {
      "adult": false,
      "backdrop_path": "/jCDycDqFJ1dIv5iJfTfub2h4ZAB.jpg",
      "genre_ids": [
        27
      ],
      "id": 836225,
      "original_language": "en",
      "original_title": "The Exorcism of God",
      "overview": "An American priest working in Mexico is considered a saint by many local parishioners. However, due to a botched exorcism, he carries a secret that’s eating him alive until he gets an opportunity to face his demon one final time.",
      "popularity": 1636.264,
      "poster_path": "/hangTmbxpSV4gpHG7MgSlCWSSFa.jpg",
      "release_date": "2022-02-10",
      "title": "The Exorcism of God",
      "video": false,
      "vote_average": 6.8,
      "vote_count": 210
    }
  ];

  const auth = getAuth();

  return (
    <>
      <section className="w-full mx-auto">
        <div className="mb-[3.75rem]">
          <h2 className="text-5xl font-bold">{auth.currentUser.displayName} 님의 감상평</h2>
          <hr/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5 m-auto">
          {Movies && Movies.map((movie,index) => (
            <ReviewCards 
              image={movie.backdrop_path ? `${IMAGE_URL}w500${movie.backdrop_path}`: null} 
              review={movie.overview} 
              title={movie.original_title} 
              movieId={movie.id} 
              index={index}
              key={index}
            />
          ))}
          
        </div>
      </section>
    </>
  )
};

export default MyReviews;