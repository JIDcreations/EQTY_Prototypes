export const lessonContent = {
  lesson_1: {
    title: 'Compound Interest',
    shortDescription: 'Momentum built by time + consistency.',
    steps: {
      concept: {
        title: 'Compounding is quiet acceleration',
        body:
          'When you reinvest gains, your base grows. That bigger base earns more next time. The earlier you start, the more time does the heavy lifting.',
        visualHint: 'Growth builds on growth, not just on deposits.',
      },
      visualization: {
        title: 'Where the lift comes from',
        segments: [
          {
            id: 'segment_1',
            label: 'Consistency',
            value: 0.22,
            description: 'Small monthly contributions create a reliable base for growth.',
          },
          {
            id: 'segment_2',
            label: 'Time',
            value: 0.34,
            description: 'Duration multiplies returns. Every extra year compounds the last.',
          },
          {
            id: 'segment_3',
            label: 'Rate',
            value: 0.26,
            description: 'Modest returns beat perfect timing when repeated for long stretches.',
          },
          {
            id: 'segment_4',
            label: 'Reinvest',
            value: 0.18,
            description: 'Reinvestment turns gains into future principal.',
          },
        ],
      },
      scenario: {
        title: 'Make it personal',
        variants: {
          new: {
            prompt:
              'You are 24 and just set aside your first investing budget. You can commit $120 per month. Which choice feels most sustainable?',
            options: ['Automate a monthly transfer', 'Invest only when markets dip', 'Wait until income grows'],
            insight:
              'Automation beats mood. A steady habit creates compounding even when the market feels noisy.',
          },
          growing: {
            prompt:
              'You are 32 and already invest occasionally. You want more momentum without stress. What is your next move?',
            options: ['Increase contributions slightly', 'Switch strategies every quarter', 'Pause when news feels negative'],
            insight:
              'Small, consistent increases matter more than chasing a perfect strategy.',
          },
          seasoned: {
            prompt:
              'You are 41 with solid investing experience. You want to accelerate results without overtrading. What action fits?',
            options: ['Lengthen the time horizon', 'Concentrate on one bet', 'React quickly to every swing'],
            insight:
              'Compounding respects patience. A longer horizon reduces the need for reactive moves.',
          },
        },
      },
      exercise: {
        title: 'Run a compounding simulation',
        description:
          'Set the inputs, then run the simulation to see how time changes the outcome.',
        defaults: {
          contribution: 150,
          years: 12,
          returnRate: 6,
        },
        ranges: {
          contribution: { min: 50, max: 500, step: 10 },
          years: { min: 5, max: 30, step: 1 },
          returnRate: { min: 3, max: 10, step: 0.5 },
        },
      },
      reflection: {
        question: 'What habit would make compounding easier for you to sustain?'
      },
      summary: {
        takeaways: [
          'Consistency outperforms intensity over time.',
          'Time is the strongest multiplier in any plan.',
          'Reinvesting gains creates exponential momentum.',
        ],
        video: {
          label: 'Watch: The quiet power of compounding',
          url: 'https://www.example.com',
        },
      },
    },
  },
};
