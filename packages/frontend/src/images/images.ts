import adrian from './adrian.jpg';
import aidan from './aidan.jpg';
import alexander from './alexander.jpg';
import chase from './chase.jpg';
import christopher from './christopher.jpg';
import eden from './eden.jpg';
import eliza from './eliza.jpg';
import jameson from './jameson.jpg';
import jessica from './jessica.jpg';
import jocelyn from './jocelyn.jpg';
import key from './key.jpg';
import kingston from './kingston.jpg';
import leah from './leah.jpg';
import liam from './liam.jpg';
import lighting from './lighting.jpg';
import mackanzie from './mackanzie.jpg';
import maria from './maria.jpg';
import nolan from './nolan.jpg';
import robert from './robert.jpg';
import ryan from './ryan.jpg';
import ryker from './ryker.jpg';

export interface TeamAvatar {
  readonly id: string;
  readonly src: string;
}

export const teamAvatars: Record<string, TeamAvatar> = {
  adrian: { id: 'adrian', src: adrian },
  aidan: { id: 'aidan', src: aidan },
  alexander: { id: 'alexander', src: alexander },
  chase: { id: 'chase', src: chase },
  christopher: { id: 'christopher', src: christopher },
  eden: { id: 'eden', src: eden },
  eliza: { id: 'eliza', src: eliza },
  jameson: { id: 'jameson', src: jameson },
  jessica: { id: 'jessica', src: jessica },
  jocelyn: { id: 'jocelyn', src: jocelyn },
  key: { id: 'key', src: key },
  kingston: { id: 'kingston', src: kingston },
  leah: { id: 'leah', src: leah },
  liam: { id: 'liam', src: liam },
  lighting: { id: 'lighting', src: lighting },
  mackanzie: { id: 'mackanzie', src: mackanzie },
  maria: { id: 'maria', src: maria },
  nolan: { id: 'nolan', src: nolan },
  robert: { id: 'robert', src: robert },
  ryan: { id: 'ryan', src: ryan },
  ryker: { id: 'ryker', src: ryker }
} as const;

export const teamAvatarsArray = Object.values(teamAvatars);

export type TeamAvatarName = keyof typeof teamAvatars;
