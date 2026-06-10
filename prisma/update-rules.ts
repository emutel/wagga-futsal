import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const RULES_CONTENT = `# Wagga Futsal Competition Rules 2025–2026

## 1. Competitions – Team Requirements

Competitions are covered under these guidelines.

- 1.1 Junior competitions are open to players aged 5–16 years.
- 1.2 ALL teams must have a minimum of 7 registered players and a maximum of 10.
- 1.3 All teams must have at least one person(s) over the age of 18 as a registered team official.
- 1.4 ALL teams should have an appointed Official Coach or Manager who is with them while they are playing and is seated in the Technical Area to assist with substitutions, injuries and disciplinary matters.

## 2. Match Balls

- 2.1 Match balls will be Deploy Futsal Balls. Balls used for Finals Series must bear the official logo 'FIFA approved' or 'FIFA inspected'.
- 2.2 Size 3 match balls are to be used for all age groups up to and including Under 12s. Size 4 match balls are to be used for all other age groups including open age.
- 2.3 Wagga Futsal shall supply all Match Balls.

## 3. Identification and Registration

- 3.1 ALL players must be registered with FFA and their requisite State Federation as a Futsal player for the 2025/2026 season in order to participate in the competition.
- 3.2 Upon request of match officials, players must provide valid photo identification. Where a player is unable to produce proof of identification, the matter will be reported to the Competition Coordinator who will subsequently take the appropriate decision against the player and team involved.

## 4. Compulsory Equipment

### 4.1 Basic Uniform

**Playing Uniforms must be independent of any Football Wagga Wagga or Football Australia associated club. This includes Football New South Wales (FNSW) attire, Capital Football attire, Wagga City Wanderers attire and any attire that is associated with any club.**

- 4.1.2 Playing shorts must be matching. If undershorts are worn, they must be the same colour as the playing shorts.
- 4.1.3 Goal Keepers must wear uniforms that clearly contrast with the rest of the team, the opposing team and the referee.
- 4.1.4 All Playing shirts must be **CLEARLY** numbered on the back. No two shirts may display the same number. Numbers must be permanently fixed to the back of the shirt; use of tape is not permitted. No un-numbered bibs will be allowed.
- 4.1.5 Teams are not to have uniforms that clash with referee uniforms.
- 4.1.6 Matching long socks must be worn by all team members. Socks must cover the shin pads entirely.
- 4.1.7 Shin pads must be worn. Shin pads must comply with Law 4 of the FIFA Laws of the Game — made of rubber, plastic or a similar approved material and must provide a reasonable degree of protection by covering the shins.
- 4.1.8 Non-marking shoes must be worn at all times.
- 4.1.9 Where the colours of both teams are sufficiently similar it is the responsibility of the second listed team on the draw to change into an alternate coloured strip, with numbers, or use the numbered bibs provided by Wagga Futsal ONLY.

### 4.3 Jewellery

- 4.3.1 As per Law 4 of the FIFA Laws of the Game the wearing of jewellery is not permitted.
- 4.3.2 Official Medic Alert bracelets and necklaces are the only jewellery approved to be worn. All Medic Alert bracelets and necklaces must be securely taped to the body and the referees informed of them being worn prior to the game.
- 4.3.3 **NO TAPING of piercings is permitted in any Wagga Futsal Competition.**

## 5. Referees

During the Regular Wagga Futsal Season all league competition games will be refereed by 1 (one) referee with the aid of a timekeeper. ONLY in the finals series will 2 (two) referees be appointed to officiate the games, along with a timekeeper.

### 5.1 Appointments

- 5.1.1 Unless otherwise decided, the appointment of referees will be made by the Wagga Futsal Competition Managers, namely Samuel Gray or Amanda Gray.

### 5.2 Persons not to approach referee

- 5.2.1 With the exemption of team manager/captains carrying out the requirements of Rule 12 (Match Sheets) no person may approach the referee at the end of a game for any purpose whatsoever without his or her consent.

### 5.5 Decisions of the referees

The decisions of the referee(s) regarding facts connected with play, including whether or not a goal is scored and the result of the match, are final.

## 7. Eligibility

### 7.1 Age-Based Competitions

No player may play for any team unless he/she is correctly registered with the appropriate Federation in line with registration guidelines (Rule 3.1).

### 7.2 Age Groups

| Age Group | Minimum Age | Maximum Birth Date |
|---|---|---|
| Under 8s | 5 years | On or after 1 January 2017 |
| Under 10s | 8 years | On or after 1 January 2015 |
| Under 12s | 9 years | On or after 1 January 2013 |
| Under 14s | 11 years | On or after 1 January 2011 |
| Under 16s | 13 years | On or after 1 January 2009 |
| Under 19s, Opens & Social | 16 years | On or after 1 January 2004 |

*Players are NOT permitted to play in an age group lower than that in which they register, regardless of the fact that they may be eligible.*

*A player may only play in an age group higher than their registered age group if they meet the minimum age requirement AND if a consent form has been completed by their parent/guardian and submitted and approved by Wagga Futsal. NO EXCEPTIONS.*

- 7.4 Male players are not permitted to play in female only competitions.
- 7.5 Female players playing in mixed or open competitions are permitted to play down one (1) age group below their defined age group with the approval of Wagga Futsal.

## 8. Draws

- 8.1 Draws for the competition will be e-mailed to competing teams and published on the Wagga Futsal website.
- 8.2 Draws are subject to change at late notice. Wagga Futsal will endeavour to contact all teams affected by such changes.
- 8.3 Teams are responsible for checking the draw regularly prior to their matches to ensure they are aware of any draw changes.

## 10. Conduct of Games

### 10.4 Tackling

- 10.4.1 In no circumstances are players allowed to tackle from behind. Even if the tackle is seen as a clean possession a direct free kick will be awarded to the opposition.
- 10.4.2 **Under no circumstances are players allowed to slide tackle.** A slide tackle will result in an instant card (yellow or red) at the referee's discretion. The goalkeeper is allowed to slide along the ground, so long as the slide is within the goal area.

### 10.5 Goalkeepers

- 10.5.1 The goalkeeper CAN throw the ball to the halfway line as long as they do so from their own goal area and within the four (4) seconds allotted for restarts.
- 10.5.3 The goalkeeper has a 4 second time limit to release the ball.
- 10.5.4 Goalkeepers are **NOT** allowed to pick up a pass from any of their team mates (back pass).
- 10.5.5 Once a goalkeeper has released the ball from their possession, the ball CANNOT be played back to the keeper unless the ball has been touched by an opposing player (2 touch rule).

### 10.6 Game Duration

- **Under 8/10/12:** 2 × 13-minute halves, 1-minute half-time break
- **Under 14/16:** 2 × 15-minute halves, 1-minute half-time break
- **Under 19s, Opens & Social:** 2 × 20-minute halves, 3-minute half-time break

**THERE WILL BE NO TIME ADDED ON AT THE END OF EITHER HALF, UNLESS A SERIOUS INJURY OCCURS AND THIS IS AT THE DISCRETION OF THE REFEREE IN CHARGE.**

### 10.7 Pitches

Pitches shall be the indoor pitches at EQUEX Multi Purpose Sports Centre OR Bolton Park Stadium, Wagga Wagga OR at a nominated Wagga Futsal Venue.

### 10.8 Points Allocation

- 3 points for a win
- 1 point for a draw
- 0 points for a loss or bye

## 11. Points Table

At the completion of the competition round robin matches, the points table placement will be determined by:

1. Points accrued
2. Goal difference (if equal on points)
3. Goals for (if still equal)
4. Head-to-head result (if still equal)
5. Coin toss (if still equal)

## 12. Match Sheets

All match sheets will be provided by Wagga Futsal.

- 12.1 It is the responsibility of the respective teams to ensure that match sheets are correct and include all player's names and shirt numbers prior to the start of the game.
- 12.2 Only players correctly listed on the match sheet at the start of play will be permitted to participate.
- 12.3 Should a player take the pitch that is not listed on the match card prior to the commencement of the game, this will result in a loss of one goal to the opposition.
- 12.9 Match sheet must be signed by a representative of each team at the conclusion of the game. If left unsigned this may result in a turnover of the result.

## 13. Late Start

- 13.1 Teams not ready to kick off at the scheduled time will immediately be penalised one goal and a further goal for every 2 (two) minutes that they are late.
- 13.2 If a team is not ready to kick off after five minutes past the scheduled kick off time the team will be considered to have forfeited the game.

## 14. Rescheduling of Matches

- 14.1 Rescheduling of matches by teams will not be permitted.

## 15. Forfeiture of Games

- 15.1 Teams must notify Wagga Futsal at least 24 hours prior to their game of their intention to forfeit.
- 15.2 Notification of forfeiture must be in writing, either via e-mail or by hand.
- 15.3 Forfeiture of games will result in a score-line of **5–0** being recorded against the forfeiting team.
- 15.4 Teams forfeiting twice in a single season may be removed from the competition, with no refund of fees.

## 16. Abandonment of Games

- 16.1 An abandoned game as a result of player, spectator, or team official's conduct will result in the awarding of a 5–0 result against the offending team.
- 16.5 Where abandonment is due to circumstances beyond the control of the referee (unsafe conditions, power failure, etc.), neither team will be penalised and the game will recommence once conditions are deemed satisfactory within 30 minutes.
- 16.7 If games are unable to recommence within 30 minutes, games will be deemed a 1–1 draw.

## 17. Minimum Number of Players

- 17.1 Any team that has less than three (3) players on the pitch either before or during the match will be considered to have forfeited the game.
- 17.2 A minimum of 3 players are required on pitch to commence a game.

## 20. Substitution Procedure

- 20.1 A substitution may be made at any time, whether the ball is in play or not.
- 20.2 The player leaves the pitch via his own team's substitution zone. The substitute only enters the pitch after the player being replaced has left.

## 22. Borrowing of Players

- 22.1 Players cannot be borrowed from another team in the same competition in which they are playing.
- 22.2 Players cannot be borrowed at any time to fulfil fixtures.

## 24. Yellow and Red Cards and Suspensions

### 24.1 Yellow Cards

- If a player accrues **3 yellow cards** in the competition, that player shall serve an automatic one (1) match ban in the next scheduled match.
- All yellow cards continue from the regular season through into the finals series.

### 24.2 Red Cards

- Any player who receives a red card in a match must serve an automatic **one (1) match ban** in the next scheduled match in that competition.
- The suspension may be increased, dependent on the offence.

### 24.3 Suspensions

- Any player who receives a suspension must serve that suspension in the next scheduled round for all competitions until the suspension is served completely.
- If a player is suspended in one age group they cannot play in a different age group until their suspension is completed.

## 25. Injured Players

- 25.1 Stoppage for an injury must be resolved within 2 minutes. If possible, the injured player should be removed from the court within this time. Teams unable to resume play are deemed to have forfeited. Coaches must ensure all injuries for their players are noted on the Incident Log at the front desk.

---

## Appendix 1 — Additional Court Fees for Playing Two Competitions

| First Age Group | Second Age Group | Additional Court Fees |
|---|---|---|
| Under 8 | Under 10 | $130 |
| Under 10 | Under 12 | $130 |
| Under 12 | Under 14 | $130 |
| Under 14 | Under 16 | $130 |
| Under 16 | Opens | $130 |
| Under 19 | Opens | $130 |

Payment: Wagga Futsal Pty Ltd · Westpac Bank · BSB: 732769 · Account: 927477. Reference: Player Name + Pitch Fees.
`;

async function main() {
  console.log("Updating rules document...");

  const existing = await prisma.rulesDocument.findFirst({ where: { active: true } });

  if (existing) {
    await prisma.rulesDocument.update({
      where: { id: existing.id },
      data: {
        title: "Wagga Futsal Competition Rules 2025–2026",
        content: RULES_CONTENT,
        version: "1.1",
        publishedAt: new Date("2025-07-01"),
        active: true,
      },
    });
    console.log("✓ Updated existing rules document");
  } else {
    await prisma.rulesDocument.create({
      data: {
        title: "Wagga Futsal Competition Rules 2025–2026",
        content: RULES_CONTENT,
        version: "1.1",
        publishedAt: new Date("2025-07-01"),
        active: true,
      },
    });
    console.log("✓ Created rules document");
  }

  await prisma.$disconnect();
}

main().catch(console.error);
