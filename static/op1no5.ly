\version "2.22.0"
\language "english"
\header {
  title = "钢琴曲"
  subtitle = "Op. 1, No. 5 「暮雨和晚霞」"
  composer = "谭淞宸"
  dedication = "为张睿涵 25 岁生日而作"
  copyright = "© 谭淞宸 2022"
  tagline = ""
  instrument = ""
}

\paper {
  #(define fonts
    (set-global-fonts
     #:roman "Lilypond Serif, Songti SC, STSong, SimSun"
     #:sans "Lilypond Sans Serif, PingFang SC, STXihei, SimHei"
     #:typewriter "Lilypond Monospace, Kaiti SC, STKaiti, SimKai"
    ))
}

keytime = { \key d \major \time 6/4 }
twice = #(define-music-function (mus) (ly:music?) #{ \repeat unfold 2 { #mus } #})
thrice = #(define-music-function (mus) (ly:music?) #{ \repeat unfold 3 { #mus } #})
quadrice = #(define-music-function (mus) (ly:music?) #{ \repeat unfold 4 { #mus } #})

prelogRA = { fs16 cs e d as b cs fs, b a d, e }
prelogRB = { g16 cs, fs e a,! as cs fs, as cs, d e }
prelogLA = { b8 fs' d' fs, cs' fs, }
prelogLB = { as8 g' e' g, cs g }
verseRA = { b8 cs d e fs b cs2 fs,4 b8 cs d cs b a fs2. \twice { e8 fs b,4 d } cs8 fs, cs' e d cs b2. }
verseLA = { b8 fs' b4 4 as,8 g' <cs e>4 4 b,8 fs' <b d>4 4 a,8 fs' <a d>4 4 g,8 e' <g b>4 4 gs,8 b <d f>4 4 fs,8 as <cs e>4 4 b8 fs' <b d>4 4 }
verseLB = {
  b8 fs' b fs d' fs,
  as, g' cs g e' g,
  b,8 fs' b fs d' fs,
  a, fs' a fs d' fs,
  g, g' b g e' g,
  gs, b' f' b, d b
  fs, fs' cs' as e' cs
  b, fs' b cs d4
}
bridgeR = {
  b8^\markup \italic "accel." g cs g d' g, b g cs g d' g, b fs cs' fs, d' fs, fs' fs, e' fs, d' fs,
  b8 g cs g d' g, b e, cs' e, d' e, e' a, cs e g e a g cs a e' cs\fermata
}
bridgeL = {
  g,4 d b a, e b b, fs b d' b fs
  g, d b e, b, gs a,1.
}
chorusRA = { \twice { d8 fs a d a fs } \twice { cs fs a cs a fs } \twice { b, e g b g e } a, d fs a fs d a cs e g e cs }
chorusLA = { d2 e4 fs g a cs1. b2. b4 a g fs2. e }
chorusRB = { d8 d, fs a e' d, fs' a, g' a, a' a, cs' cs, fs a fs cs cs' cs, fs a cs cs, b' b, e g e b b' b, a' b, g' b, fs'^\markup \italic "rit." a, d fs d a e' a, cs e cs a }
chorusLB = { d4 fs a d fs a cs fs a cs fs a b, e g b, e g a, d fs a, cs e }
epilogRA = { fs16 a, d fs, a d, fs a, d fs, a d, e2 r8 g' }
epilogRB = { g16 cs, e a, cs e, g16 cs, e a, cs e, fs2. }
epilogL = { d8 a d' a fs' a a, e a e cs' e a, e a e cs' e d8 a d' fs'4. }

\score {
  \new PianoStaff {
    <<
      \new Staff {
        \keytime
        \tempo 4 = 72
        \relative c'' { r2. r4 r fs }
        \relative c''' { \prelogRA \prelogRA }
        \relative c' { fs2. r4 r g' }
        \relative c'''' { \prelogRB \prelogRB }
        \relative c'' { g2 fs4 e d cs }
        \tempo "优雅地" 4 = 80
        \relative c' { \verseRA }
        \relative c'' { \verseRA }
        \relative c'' { \bridgeR }
        \tempo "明快地" 4 = 96
        \ottava #1
        \relative c''' { \chorusRA }
        \ottava #0
        \relative c'' { \chorusRB }
        \relative c' { <fs a d>1 fs8 a d fs }
        \tempo 4 = 60
        \relative c''' { \epilogRA }
        \relative c'''' { \epilogRB }
        \relative c' { <g b d fs>1 e'2 <fs, a d>1. }
        \bar "|."
      }
      \new Staff {
        \keytime
        \clef "bass"
        \relative c { \thrice \twice \prelogLA  }
        \relative c { \thrice \prelogLB { as,8 e' <e g>4 4 } }
        \relative c { \verseLA }
        \relative c { \verseLB }
        \bridgeL
        \clef "treble"
        \relative c' { \chorusLA }
        \clef "bass"
        \chorusLB
        \relative c, { <d d'>2 d8 d' a' d r2 }
        \epilogL
        \relative c { <g g'>1. <d d'>1. }
        \bar "|."
      }
    >>
  }
}
