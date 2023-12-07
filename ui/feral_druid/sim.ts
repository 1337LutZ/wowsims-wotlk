import {
	Class,
	Debuffs,
	Faction,
	IndividualBuffs,
	PartyBuffs,
	PseudoStat,
	Race,
	RaidBuffs,
	Spec,
	Stat,
	TristateEffect,
} from '../core/proto/common.js';
import { IndividualSimUI, registerSpecConfig } from '../core/individual_sim_ui.js';
import { Stats } from '../core/proto_utils/stats.js';
import { getSpecIcon, specNames } from '../core/proto_utils/utils.js';
import { Player } from '../core/player.js';

import * as IconInputs from '../core/components/icon_inputs.js';
import * as OtherInputs from '../core/components/other_inputs.js';

import * as DruidInputs from './inputs.js';
import * as Presets from './presets.js';
import { APLRotation } from 'ui/core/proto/apl.js';
import { optimizeGems } from '../shared/auto_gem.js';

const SPEC_CONFIG = registerSpecConfig(Spec.SpecFeralDruid, {
	cssClass: 'feral-druid-sim-ui',
	cssScheme: 'druid',
	// List any known bugs / issues here and they'll be shown on the site.
	knownIssues: [
	],
	warnings: [
	],

	// All stats for which EP should be calculated.
	epStats: [
		Stat.StatStrength,
		Stat.StatAgility,
		Stat.StatAttackPower,
		Stat.StatMeleeHit,
		Stat.StatMeleeCrit,
		Stat.StatMeleeHaste,
		Stat.StatArmorPenetration,
		Stat.StatExpertise,
	],
	epPseudoStats: [
		PseudoStat.PseudoStatMainHandDps,
	],
	// Reference stat against which to calculate EP. I think all classes use either spell power or attack power.
	epReferenceStat: Stat.StatAttackPower,
	// Which stats to display in the Character Stats section, at the bottom of the left-hand sidebar.
	displayStats: [
		Stat.StatHealth,
		Stat.StatStrength,
		Stat.StatAgility,
		Stat.StatAttackPower,
		Stat.StatMeleeHit,
		Stat.StatMeleeCrit,
		Stat.StatMeleeHaste,
		Stat.StatArmorPenetration,
		Stat.StatExpertise,
		Stat.StatMana,
	],

	defaults: {
		// Default equipped gear.
		gear: Presets.P4_PRESET.gear,
		// Default EP weights for sorting gear in the gear picker.
		epWeights: Stats.fromMap({
			[Stat.StatStrength]: 2.40,
			[Stat.StatAgility]: 2.39,
			[Stat.StatAttackPower]: 1,
			[Stat.StatMeleeHit]: 2.51,
			[Stat.StatMeleeCrit]: 2.23,
			[Stat.StatMeleeHaste]: 1.83,
			[Stat.StatArmorPenetration]: 2.08,
			[Stat.StatExpertise]: 2.44,
		}, {
			[PseudoStat.PseudoStatMainHandDps]: 16.5,
		}),
		// Default consumes settings.
		consumes: Presets.DefaultConsumes,
		// Default rotation settings.
		rotation: Presets.DefaultRotation,
		// Default talents.
		talents: Presets.StandardTalents.data,
		// Default spec-specific settings.
		specOptions: Presets.DefaultOptions,
		// Default raid/party buffs settings.
		raidBuffs: RaidBuffs.create({
			arcaneBrilliance: true,
			giftOfTheWild: TristateEffect.TristateEffectImproved,
			bloodlust: true,
			manaSpringTotem: TristateEffect.TristateEffectRegular,
			strengthOfEarthTotem: TristateEffect.TristateEffectImproved,
			battleShout: TristateEffect.TristateEffectImproved,
			unleashedRage: true,
			icyTalons: true,
			swiftRetribution: true,
			sanctifiedRetribution: true,
		}),
		partyBuffs: PartyBuffs.create({
			heroicPresence: true,
		}),
		individualBuffs: IndividualBuffs.create({
			blessingOfKings: true,
			blessingOfMight: TristateEffect.TristateEffectImproved,
		}),
		debuffs: Debuffs.create({
			judgementOfWisdom: true,
			bloodFrenzy: true,
			giftOfArthas: true,
			exposeArmor: true,
			faerieFire: TristateEffect.TristateEffectImproved,
			sunderArmor: true,
			curseOfWeakness: TristateEffect.TristateEffectRegular,
			heartOfTheCrusader: true,
		}),
	},

	// IconInputs to include in the 'Player' section on the settings tab.
	playerIconInputs: [
	],
	// Inputs to include in the 'Rotation' section on the settings tab.
	rotationInputs: DruidInputs.FeralDruidRotationConfig,
	// Buff and Debuff inputs to include/exclude, overriding the EP-based defaults.
	includeBuffDebuffInputs: [
		IconInputs.IntellectBuff,
		IconInputs.MP5Buff,
		IconInputs.JudgementOfWisdom,
	],
	excludeBuffDebuffInputs: [
	],
	// Inputs to include in the 'Other' section on the settings tab.
	otherInputs: {
		inputs: [
			DruidInputs.LatencyMs,
			DruidInputs.AssumeBleedActive,
			OtherInputs.TankAssignment,
			OtherInputs.InFrontOfTarget,
		],
	},
	encounterPicker: {
		// Whether to include 'Execute Duration (%)' in the 'Encounter' section of the settings tab.
		showExecuteProportion: false,
	},

	presets: {
		// Preset talents that the user can quickly select.
		talents: [
			Presets.StandardTalents,
		],
		rotations: [
			Presets.ROTATION_PRESET_LEGACY_DEFAULT,
			Presets.APL_ROTATION_DEFAULT,
		],
		// Preset gear configurations that the user can quickly select.
		gear: [
			Presets.PRERAID_PRESET,
			Presets.P1_PRESET,
			Presets.P2_PRESET,
			Presets.P3_PRESET,
			Presets.P4_PRESET,
		],
	},

	autoRotation: (_player: Player<Spec.SpecFeralDruid>): APLRotation => {
		return Presets.ROTATION_PRESET_LEGACY_DEFAULT.rotation.rotation!;
	},

	raidSimPresets: [
		{
			spec: Spec.SpecFeralDruid,
			tooltip: specNames[Spec.SpecFeralDruid],
			defaultName: 'Cat',
			iconUrl: getSpecIcon(Class.ClassDruid, 3),

			talents: Presets.StandardTalents.data,
			specOptions: Presets.DefaultOptions,
			consumes: Presets.DefaultConsumes,
			defaultFactionRaces: {
				[Faction.Unknown]: Race.RaceUnknown,
				[Faction.Alliance]: Race.RaceNightElf,
				[Faction.Horde]: Race.RaceTauren,
			},
			defaultGear: {
				[Faction.Unknown]: {},
				[Faction.Alliance]: {
					1: Presets.P1_PRESET.gear,
					2: Presets.P2_PRESET.gear,
					3: Presets.P3_PRESET.gear,
					4: Presets.P4_PRESET.gear,
				},
				[Faction.Horde]: {
					1: Presets.P1_PRESET.gear,
					2: Presets.P2_PRESET.gear,
					3: Presets.P3_PRESET.gear,
					4: Presets.P4_PRESET.gear,
				},
			},
		},
	],
});

export class FeralDruidSimUI extends IndividualSimUI<Spec.SpecFeralDruid> {
	constructor(parentElem: HTMLElement, player: Player<Spec.SpecFeralDruid>) {
		super(parentElem, player, SPEC_CONFIG);

		this.addOptimizeGemsAction();
	}

	addOptimizeGemsAction() {
		this.addAction('Suggest Gems', 'optimize-gems-action', async () => {
			await optimizeGems(this.sim, this.player);
		});
	}
}
