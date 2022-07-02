package com.someg.auction.service.impl;

import com.someg.auction.domain.Users;
import com.someg.auction.repository.UsersRepository;
import com.someg.auction.service.UsersService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Users}.
 */
@Service
@Transactional
public class UsersServiceImpl implements UsersService {

    private final Logger log = LoggerFactory.getLogger(UsersServiceImpl.class);

    private final UsersRepository usersRepository;

    public UsersServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public Users save(Users users) {
        log.debug("Request to save Users : {}", users);
        return usersRepository.save(users);
    }

    @Override
    public Users update(Users users) {
        log.debug("Request to save Users : {}", users);
        return usersRepository.save(users);
    }

    @Override
    public Optional<Users> partialUpdate(Users users) {
        log.debug("Request to partially update Users : {}", users);

        return usersRepository
            .findById(users.getId())
            .map(existingUsers -> {
                if (users.getUserName() != null) {
                    existingUsers.setUserName(users.getUserName());
                }

                return existingUsers;
            })
            .map(usersRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Users> findAll() {
        log.debug("Request to get all Users");
        return usersRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Users> findOne(Long id) {
        log.debug("Request to get Users : {}", id);
        return usersRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Users : {}", id);
        usersRepository.deleteById(id);
    }
}
