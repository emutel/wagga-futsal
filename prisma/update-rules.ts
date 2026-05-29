import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const RULES_CONTENT = `# FOOTBALL WAGGA Competition Rules 2025–2026

## 1. Competitions – Team Requirements

Competitions are covered under these guidelines.

- 1.1 Junior competitions are open to players aged 5–16 years.
- 1.2 ALL teams must have a minimum of 7 registered players and a maximum of 10.
- 1.3 All teams must have at least one person(s) over the age of 18 as a registered team official.
- 1.4 ALL teams should have an appointed Official Coach or Manager who is with them while they are playing and is seated in the Technical Area to assist with substitutions, injuries and disciplinary matters.

## 2. Match Balls

- 2.1 Only balls authorised by Football NSW are to be used.
- 2.2 Size 3 match balls are to be used for all age groups up to and including Under 9s.
- 2.3 FOOTBALL WAGGA shall supply all Match Balls.

## 3. Identification and Registration

- 3.1 ALL players must be registered through PlayFootball (Football NSW) for the 2026 season in order to participate in the competition.

## 4. Compulsory Equipment

- Players should not wear anything which is dangerous to another player. This includes jewellery and plaster/plastic casts.
- Boots or training shoes must be worn at all times.
- Shin pads, fully covered with socks, must be worn.

## 5. Referees

- Under 5/6/7: No referees. A 'Game Leader' from each team (usually the Coach) may be on the field to assist players.
- Under 8/9: Instructing referees, usually children aged 11–13, help ensure the game is played in a fluent manner with minimal stoppages.

## 8. Draws

- 8.1 Draws are published on the FOOTBALL WAGGA website.
- 8.2 Draws are subject to change. FOOTBALL WAGGA will endeavour to contact all teams affected.
- 8.3 Teams are responsible for checking the draw regularly prior to their matches.

## 10. Conduct of Games

### 10.8 Points Allocation

- 3 points for a win
- 1 point for a draw
- 0 points for a loss or bye

## 15. Forfeiture of Games

- 15.1 Teams must notify FOOTBALL WAGGA at least 24 hours prior to their game of their intention to forfeit.
- 15.3 Forfeiture of games will result in a score-line of **5–0** being recorded against the forfeiting team.

---

# MiniRoos Guidelines

## Under 5, 6 and 7 Guidelines

**Ball Size: 3**

### 1. Number of Players
4 players (no goalkeeper) plus up to 3 interchange players. Interchange is encouraged to provide each player with equal time. A 'Game Leader' from each team, usually the Coach, may be on the field to assist players in fair and correct play. **There are no referees.**

### 2. Players Equipment
Players should not wear anything dangerous to another player. This includes jewellery and plaster/plastic casts. Boots or training shoes must be worn at all times. Shin pads, fully covered with socks, must be worn.

### 3. Duration of Game
2 x 20-minute halves. Half time break of 5 minutes.

### 4. Start of Play
Game Leaders are to agree who kicks off. A kick forward to a team mate from the middle of the halfway line begins the match. Opposition players must be at least 5m from the ball. The ball must touch a team mate before a goal can be scored.

### 5. Ball In and Out of Play
**Ball over Side Line:** Restarted by a kick or dribble from behind the side line by the team that did not last touch the ball. The ball must be touched by another player before a goal can be scored.

**Ball over Back Line:** No corner kick or goal kick. A player from the defending team takes a kick from anywhere behind the goal line. Opponents must go back behind the halfway line and can only move after the ball has been kicked into play.

### 6. No Offside
There is no offside.

### 7. Methods of Scoring
A goal is scored when the whole of the ball crosses the goal line and enters the goal. A goal cannot be scored directly from a kick-off or restart of play.

### 8. Fouls and Misconduct
Generally at this age, fouls are due to lack of co-ordination and are not deliberate. Game leaders should try to give advantage to the opposing team.

### 9. Free Kicks
All free kicks are indirect — the ball must touch another player before a goal can be scored. Opposing players must be 5 metres from the ball.

### 10. Encouraging Fair Play
If an individual scores 3 goals, they may only score another goal after one of their team mates has scored. Frequent interchange is encouraged so all players have equal playing time.

### 11. Spectator Lines
All spectators must remain behind the spectator line.

---

## Under 8 and 9 Guidelines

**Ball Size: 3**

### 1. Number of Players
7 players (including a goalkeeper) plus up to 3 interchange players.

### 2. Players Equipment
Players should not wear anything dangerous to another player. Boots or training shoes must be worn at all times. Shin pads, fully covered with socks, must be worn. Goalkeepers should wear a different coloured shirt to their team.

### 3. Duration of Game
2 x 20-minute halves. Half time break of 5 minutes.

### 4. Start of Play
Instructing referee will toss a coin to decide who kicks off. Opposition players must be at least 5m from the ball. The ball must touch a team mate before a goal can be scored.

### 5. Ball In and Out of Play
**Ball over Side Line:** Throw in from behind the side line by the team that did not last touch the ball. Opposition players should be 5m from the thrower.

**Ball over Back Line (defending team last touch):** Corner kick. Opposition players should be 5m from the ball.

**Ball over Back Line (attacking team last touch):** Goal kick from anywhere inside the penalty area. Opposition players should be 5m outside the penalty area.

### 6. No Offside
There is no offside.

### 7. Methods of Scoring
A goal is scored when the whole of the ball crosses the goal line and enters the goal. A goal cannot be scored directly from a kick-off or restart of play.

### 8. Goalkeepers
Keepers may handle the ball anywhere inside the penalty area. Keepers are not to 'drop kick' the ball from their hands. After a save the keeper may throw, roll or place the ball on the floor and kick it into play. Opposition players must move 5m outside the area.

### 9. Fouls and Misconduct
Generally at this age, fouls are due to lack of co-ordination and are not deliberate. The referee should try to give advantage to the opposing team.

### 10. Free Kicks
All free kicks are indirect. Opposing players must be 5 metres from the ball.

### 11. Encouraging Fair Play
If an individual scores 3 goals, they may only score another goal after one of their team mates has scored. Frequent interchange is encouraged.

### 12. Spectator Lines
All spectators must remain behind the spectator line.

### 13. Instructing Referees
Referees are usually children aged 11–13. Their role is to ensure the game is played in a fluent manner with minimal whistle blowing. They assist with correct throw ins, goal kicks, free kicks etc.

---

## Under 10 and 11 Guidelines

**Ball Size: 3**

### 1. Number of Players
7 players (including a goalkeeper) plus up to 3 interchange players.

### 2. Players Equipment
Players should not wear anything dangerous to another player. Boots or training shoes must be worn at all times. Shin pads, fully covered with socks, must be worn. Goalkeepers should wear a different coloured shirt to their team.

### 3. Duration of Game
2 x 25-minute halves. Half time break of 5 minutes.

### 4. Offside
Offside applies in Under 10 and 11 competitions.

### 5. Goalkeepers
Keepers may handle the ball anywhere inside the penalty area. Keepers are not to 'drop kick' the ball from their hands. After a save the keeper may throw, roll or place the ball on the floor and kick it into play.

### 6. Free Kicks
All free kicks are indirect. Opposing players must be 5 metres from the ball.

### 7. Encouraging Fair Play
Frequent interchange is encouraged so all players have equal playing time.

### 8. Spectator Lines
All spectators must remain behind the spectator line.

---

*These guidelines follow the Football Australia MiniRoos framework as adopted by Football Wagga Wagga for the 2026 season.*
`;

async function main() {
  console.log("Updating rules document...");

  const existing = await prisma.rulesDocument.findFirst({ where: { active: true } });

  if (existing) {
    await prisma.rulesDocument.update({
      where: { id: existing.id },
      data: {
        title: "FOOTBALL WAGGA Competition Rules & MiniRoos Guidelines 2026",
        content: RULES_CONTENT,
        version: "1.2",
        publishedAt: new Date("2026-01-01"),
        active: true,
      },
    });
    console.log("✓ Updated existing rules document");
  } else {
    await prisma.rulesDocument.create({
      data: {
        title: "FOOTBALL WAGGA Competition Rules & MiniRoos Guidelines 2026",
        content: RULES_CONTENT,
        version: "1.2",
        publishedAt: new Date("2026-01-01"),
        active: true,
      },
    });
    console.log("✓ Created rules document");
  }

  await prisma.$disconnect();
}

main().catch(console.error);
