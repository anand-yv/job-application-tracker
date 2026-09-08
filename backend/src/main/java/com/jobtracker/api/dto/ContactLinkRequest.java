package com.jobtracker.api.dto;

import java.util.List;
import java.util.UUID;

public record ContactLinkRequest(
    List<UUID> contactIds
){}