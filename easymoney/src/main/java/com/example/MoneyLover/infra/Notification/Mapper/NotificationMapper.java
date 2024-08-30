package com.example.MoneyLover.infra.Notification.Mapper;

import com.example.MoneyLover.infra.Notification.DTO.NotificationResponse;
import com.example.MoneyLover.infra.Notification.Entiti.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(source = "id",target = "id")
    @Mapping(source = "type",target = "type")
    @Mapping(source = "message",target = "message")
    List<NotificationResponse> toNotificationResponse(List<Notification> notification);
}
