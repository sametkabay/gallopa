<template>
  <div class="info-box">
    <h3>Race Mathematics</h3>
    <div class="info-content">
      <ul>
        <li>
          <strong>Movement Calculation:</strong> Each horse moves 1-10 meters every 100ms
        </li>
        <li>
          <strong>Random Component:</strong> 7 meters are completely random (1-7 range)
        </li>
        <li>
          <strong>Condition Component:</strong> 3 meters are based on horse condition (1-3 range)
        </li>
        <li>
          <strong>Condition Formula:</strong> Math.floor((condition / 100) * 3) + 1
        </li>
        <li>
          <strong>Total Movement:</strong> Random + Condition = 1-10 meters per tick
        </li>
        <li>
          <strong>Update Frequency:</strong> Every 300 milliseconds (0.3 seconds)
        </li>
        <li>
          <strong>Round Distances:</strong> Round 1: 1200m, Round 2: 1400m, Round 3: 1600m, Round 4: 1800m, Round 5: 2000m, Round 6: 2200m
        </li>
        <li>
          <strong>Horse Selection:</strong> 10 horses randomly selected per round from 20 total horses
        </li>
        <li>
          <strong>Condition Range:</strong> Each horse has a condition value between 1-100
        </li>
        <li>
          <strong>Finish Detection:</strong> Horse finishes when distance ≥ round distance
        </li>
        <li>
          <strong>Position Tracking:</strong> Horses are ranked by finish order (1st, 2nd, 3rd...)
        </li>
        <li>
          <strong>Animation Control:</strong> Running animation stops when horse finishes
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.info-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
}

.info-box h3 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
}

.info-content {
  font-size: 11px;
  line-height: 1.4;
  color: #6c757d;
}

.info-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-content li {
  margin-bottom: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-content li:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-content strong {
  color: #495057;
  font-weight: 600;
}

.info-box::-webkit-scrollbar {
  width: 6px;
}

.info-box::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.info-box::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.info-box::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
