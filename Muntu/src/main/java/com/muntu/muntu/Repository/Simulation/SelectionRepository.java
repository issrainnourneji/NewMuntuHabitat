package com.muntu.muntu.Repository.Simulation;

import com.muntu.muntu.Entity.Simulation.ProspectSelection;
import com.muntu.muntu.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SelectionRepository extends JpaRepository<ProspectSelection, Long> {
    List<ProspectSelection> findByAssignedAgent(User agent);
    List<ProspectSelection> findByAssignedAgentId(Long agentId);

}
