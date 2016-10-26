module ImprovedInitiative {
    export class CombatantPlayerViewModel {
        Name: string;
        HPDisplay: string;
        HPColor: string;
        Initiative: number;
        Id: number;
        Tags: string[];
        IsPlayerCharacter: boolean;

        constructor(creature: ICreature) {
            this.Name = creature.ViewModel ? creature.ViewModel.DisplayName() :
                creature.StatBlock().Name;
            this.Id = creature.Id;
            this.HPDisplay = this.GetHPDisplay(creature);
            this.HPColor = this.GetHPColor(creature);
            this.Initiative = creature.Initiative();
            this.IsPlayerCharacter = creature.IsPlayerCharacter;
            this.Tags = creature.Tags();
        }

        private GetHPDisplay(creature: ICreature): string {
            var monsterHpVerbosity = Store.Load(Store.User, "MonsterHPVerbosity");

            if (creature.IsPlayerCharacter || monsterHpVerbosity == "Actual HP") {
                if (creature.TemporaryHP()) {
                    return '{0}+{1}'.format(creature.CurrentHP(), creature.TemporaryHP());
                } else {
                    return '{0}'.format(creature.CurrentHP());
                }
            }

            if (monsterHpVerbosity == "Hide All") {
                return '';
            }

            if (creature.CurrentHP() <= 0) {
                return "<span class='defeatedHP'>defeated</span>";
            } else if (creature.CurrentHP() < creature.MaxHP / 2) {
                return "<span class='bloodiedHP'>bloodied</span>";
            } else if (creature.CurrentHP() < creature.MaxHP) {
                return "<span class='hurtHP'>hurt</span>";
            }
            return "<span class='healthyHP'>ok</span>";
        }

        private GetHPColor = (creature: ICreature) => {
            var monsterHpVerbosity = Store.Load(Store.User, "MonsterHPVerbosity");
            if (!creature.IsPlayerCharacter &&
                   (monsterHpVerbosity == "Monochrome Label" ||
                    monsterHpVerbosity == "Hide All")) {
                return "auto";
            }
            var green = Math.floor((creature.CurrentHP() / creature.MaxHP) * 170);
            var red = Math.floor((creature.MaxHP - creature.CurrentHP()) / creature.MaxHP * 170);
            return "rgb(" + red + "," + green + ",0)";
        }
    }
}