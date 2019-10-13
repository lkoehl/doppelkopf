import RL from "./rl";

export class AI {
  constructor(states, actions) {
    this.env = {};
    this.env.getNumStates = function() {
      return states;
    };
    this.env.getMaxNumActions = function() {
      return actions;
    };

    // create the DQN agent
    this.spec = { alpha: 0.01 }; // see full options on DQN page
    this.agent = new RL.DQNAgent(this.env, this.spec);
  }

  getAgent(states) {
    return this.agent.act(states);
  }

  setReward(reward) {
    this.agent.learn(reward);
  }
}
